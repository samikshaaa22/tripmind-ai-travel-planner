export async function POST(request: Request) {
  try {
    const { destination, startDate, endDate, travelers, budget, interests } = await request.json()

    const durationDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    )

    const prompt = `You are an expert travel planner. Generate a detailed ${durationDays}-day travel itinerary for ${destination} with SPECIFIC real venue names (not generic names).

Destination: ${destination}
Number of Travelers: ${travelers}
Budget Level: ${budget}
Interests: ${interests.join(", ")}
Duration: ${durationDays} days

IMPORTANT: Include real, specific venue names in the JSON. For example: "Café de Flore" not "a nice café". Include actual landmarks, real hotel names, and actual restaurant names for this destination.

Return ONLY valid JSON in this exact structure:
{
  "summary": "A 2-3 sentence overview of the trip",
  "coordinates": {"lat": latitude, "lng": longitude},
  "dailyItineraries": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Brief day description",
      "activities": [
        {"name": "Activity name", "venue": "Specific venue/location name"},
        {"name": "Activity name", "venue": "Specific venue/location name"}
      ],
      "meals": {
        "breakfast": {"venue": "Specific café/restaurant name", "dish": "dish name"},
        "lunch": {"venue": "Specific restaurant name", "dish": "dish name"},
        "dinner": {"venue": "Specific restaurant name", "dish": "dish name"}
      },
      "accommodation": {"name": "Real hotel name", "area": "District/area"}
    }
  ],
  "landmarks": [
    {"name": "Real landmark name", "address": "Address", "mapLink": "https://maps.google.com/?q=landmark+name+destination"}
  ],
  "hotels": [
    {"name": "Real hotel name", "rating": 4, "price": "$$$$", "mapLink": "https://maps.google.com/?q=hotel+name+destination"}
  ],
  "cafes": [
    {"name": "Real café name", "district": "District", "specialty": "Coffee/Tea", "mapLink": "https://maps.google.com/?q=cafe+name+destination"}
  ],
  "restaurants": [
    {"name": "Real restaurant name", "cuisine": "Type", "district": "District", "mapLink": "https://maps.google.com/?q=restaurant+name+destination"}
  ],
  "estimatedBudget": "Cost range",
  "packingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "localTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Generate ONLY the JSON, no other text.`

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("[v0] OPENAI_API_KEY is not defined")
      // Still return structured data with placeholders if no API key
      return Response.json(generatePlaceholderItinerary(destination, durationDays, interests, budget), { status: 200 })
    }

    console.log("[v0] Calling OpenAI API with destination:", destination)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    })

    console.log("[v0] OpenAI API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData.error)
      // Return placeholder if API fails
      return Response.json(generatePlaceholderItinerary(destination, durationDays, interests, budget), { status: 200 })
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ""

    console.log("[v0] OpenAI response received, parsing JSON...")

    let itineraryData
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      itineraryData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text)
      console.log("[v0] Successfully parsed itinerary data")
    } catch (e) {
      console.error("[v0] JSON parsing error:", e)
      itineraryData = generatePlaceholderItinerary(destination, durationDays, interests, budget)
    }

    itineraryData.images = await fetchDestinationImages(destination)

    return Response.json(itineraryData)
  } catch (error) {
    console.error("[v0] Itinerary generation error:", error)
    return Response.json(generatePlaceholderItinerary("Your Destination", 3, [], "moderate"), { status: 200 })
  }
}

async function fetchDestinationImages(destination: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&count=5&client_id=${process.env.UNSPLASH_ACCESS_KEY || ""}`,
    )
    const data = await response.json()
    return (data.results || []).map((photo: any) => photo.urls.regular).slice(0, 5)
  } catch (error) {
    console.error("[v0] Error fetching images from Unsplash:", error)
    return []
  }
}

function generatePlaceholderItinerary(destination: string, days: number, interests: string[], budget: string) {
  const destKey = destination.toLowerCase()

  const destinationDatabase: Record<string, any> = {
    paris: {
      coords: { lat: 48.8566, lng: 2.3522 },
      landmarks: [
        {
          name: "Eiffel Tower",
          address: "5 Avenue Anatole France, 75001 Paris",
          mapLink: "https://maps.google.com/?q=Eiffel+Tower+Paris",
        },
        {
          name: "Louvre Museum",
          address: "Rue de Rivoli, 75001 Paris",
          mapLink: "https://maps.google.com/?q=Louvre+Museum+Paris",
        },
        {
          name: "Notre-Dame Cathedral",
          address: "6 Parvis Notre-Dame, 75004 Paris",
          mapLink: "https://maps.google.com/?q=Notre-Dame+Cathedral+Paris",
        },
        {
          name: "Arc de Triomphe",
          address: "Place Charles de Gaulle, 75008 Paris",
          mapLink: "https://maps.google.com/?q=Arc+de+Triomphe+Paris",
        },
      ],
      hotels: [
        { name: "Le Meurice", rating: 5, price: "$$$$$", mapLink: "https://maps.google.com/?q=Le+Meurice+Hotel+Paris" },
        {
          name: "Hotel Plaza Athénée",
          rating: 5,
          price: "$$$$$",
          mapLink: "https://maps.google.com/?q=Plaza+Athénée+Paris",
        },
        {
          name: "Hôtel du Louvre",
          rating: 4,
          price: "$$$$",
          mapLink: "https://maps.google.com/?q=Hotel+du+Louvre+Paris",
        },
        {
          name: "Hotel Le Marais",
          rating: 3,
          price: "$$$",
          mapLink: "https://maps.google.com/?q=Hotel+Le+Marais+Paris",
        },
      ],
      cafes: [
        {
          name: "Café de Flore",
          district: "Saint-Germain",
          specialty: "French Café",
          mapLink: "https://maps.google.com/?q=Café+de+Flore+Paris",
        },
        {
          name: "Les Deux Magots",
          district: "Saint-Germain",
          specialty: "French Café",
          mapLink: "https://maps.google.com/?q=Les+Deux+Magots+Paris",
        },
        {
          name: "Café de la Paix",
          district: "Opera",
          specialty: "French Café",
          mapLink: "https://maps.google.com/?q=Café+de+la+Paix+Paris",
        },
      ],
      restaurants: [
        {
          name: "L'Astrance",
          cuisine: "French",
          district: "Passy",
          mapLink: "https://maps.google.com/?q=L'Astrance+Paris",
        },
        {
          name: "Septime",
          cuisine: "Contemporary",
          district: "11th",
          mapLink: "https://maps.google.com/?q=Septime+Paris",
        },
        {
          name: "Le Jules Verne",
          cuisine: "French",
          district: "Eiffel Tower",
          mapLink: "https://maps.google.com/?q=Le+Jules+Verne+Paris",
        },
      ],
    },
    tokyo: {
      coords: { lat: 35.6762, lng: 139.6503 },
      landmarks: [
        {
          name: "Tokyo Tower",
          address: "4 Chome Shibakoen, Minato Ward",
          mapLink: "https://maps.google.com/?q=Tokyo+Tower",
        },
        {
          name: "Senso-ji Temple",
          address: "2 Chome Asakusa, Taito Ward",
          mapLink: "https://maps.google.com/?q=Senso-ji+Temple+Tokyo",
        },
        {
          name: "Meiji Shrine",
          address: "1-1 Yoyogikamizonocho, Shibuya Ward",
          mapLink: "https://maps.google.com/?q=Meiji+Shrine+Tokyo",
        },
        {
          name: "Imperial Palace",
          address: "1-1 Chiyoda, Chiyoda Ward",
          mapLink: "https://maps.google.com/?q=Imperial+Palace+Tokyo",
        },
      ],
      hotels: [
        {
          name: "The Peninsula Tokyo",
          rating: 5,
          price: "$$$$$",
          mapLink: "https://maps.google.com/?q=Peninsula+Tokyo+Hotel",
        },
        {
          name: "Mandarin Oriental Tokyo",
          rating: 5,
          price: "$$$$$",
          mapLink: "https://maps.google.com/?q=Mandarin+Oriental+Tokyo",
        },
        { name: "Park Hyatt Tokyo", rating: 5, price: "$$$$$", mapLink: "https://maps.google.com/?q=Park+Hyatt+Tokyo" },
      ],
      cafes: [
        {
          name: "Omotesando Koffee",
          district: "Shibuya",
          specialty: "Specialty Coffee",
          mapLink: "https://maps.google.com/?q=Omotesando+Koffee+Tokyo",
        },
        {
          name: "Blue Bottle Coffee",
          district: "Nakameguro",
          specialty: "Third Wave Coffee",
          mapLink: "https://maps.google.com/?q=Blue+Bottle+Coffee+Tokyo",
        },
        {
          name: "Café Kitsuné",
          district: "Ginza",
          specialty: "Japanese Café",
          mapLink: "https://maps.google.com/?q=Café+Kitsuné+Tokyo",
        },
      ],
      restaurants: [
        {
          name: "Sukiyabashi Jiro",
          cuisine: "Sushi",
          district: "Ginza",
          mapLink: "https://maps.google.com/?q=Sukiyabashi+Jiro+Tokyo",
        },
        { name: "Nabezo", cuisine: "Hot Pot", district: "Shibuya", mapLink: "https://maps.google.com/?q=Nabezo+Tokyo" },
        {
          name: "Ichiran",
          cuisine: "Ramen",
          district: "Multiple",
          mapLink: "https://maps.google.com/?q=Ichiran+Ramen+Tokyo",
        },
      ],
    },
    london: {
      coords: { lat: 51.5074, lng: -0.1278 },
      landmarks: [
        {
          name: "Big Ben",
          address: "Palace of Westminster, SW1A 2AQ",
          mapLink: "https://maps.google.com/?q=Big+Ben+London",
        },
        {
          name: "Tower of London",
          address: "Tower Bridge, EC3N 4AB",
          mapLink: "https://maps.google.com/?q=Tower+of+London",
        },
        {
          name: "Buckingham Palace",
          address: "SW1A 1AA",
          mapLink: "https://maps.google.com/?q=Buckingham+Palace+London",
        },
        {
          name: "British Museum",
          address: "Great Russell Street, WC1B 3DG",
          mapLink: "https://maps.google.com/?q=British+Museum+London",
        },
      ],
      hotels: [
        { name: "The Ritz", rating: 5, price: "$$$$$", mapLink: "https://maps.google.com/?q=The+Ritz+London" },
        { name: "Claridge's", rating: 5, price: "$$$$$", mapLink: "https://maps.google.com/?q=Claridges+London" },
        {
          name: "Four Seasons London",
          rating: 5,
          price: "$$$$$",
          mapLink: "https://maps.google.com/?q=Four+Seasons+London",
        },
      ],
      cafes: [
        {
          name: "Flat White",
          district: "Soho",
          specialty: "Specialty Coffee",
          mapLink: "https://maps.google.com/?q=Flat+White+Soho+London",
        },
        {
          name: "Milk",
          district: "Shoreditch",
          specialty: "Coffee & Brunch",
          mapLink: "https://maps.google.com/?q=Milk+Shoreditch+London",
        },
        {
          name: "Dear Mama",
          district: "Fitzrovia",
          specialty: "Modern Café",
          mapLink: "https://maps.google.com/?q=Dear+Mama+London",
        },
      ],
      restaurants: [
        {
          name: "The Ivy",
          cuisine: "British",
          district: "Covent Garden",
          mapLink: "https://maps.google.com/?q=The+Ivy+London",
        },
        { name: "Sketch", cuisine: "French", district: "Mayfair", mapLink: "https://maps.google.com/?q=Sketch+London" },
        {
          name: "Dishoom",
          cuisine: "Indian",
          district: "Covent Garden",
          mapLink: "https://maps.google.com/?q=Dishoom+London",
        },
      ],
    },
  }

  const destInfo = destinationDatabase[destKey] || {
    coords: { lat: 0, lng: 0 },
    landmarks: [
      {
        name: "Main Landmark",
        address: "Central Area",
        mapLink: "https://maps.google.com/?q=" + encodeURIComponent(destination),
      },
    ],
    hotels: [
      {
        name: "Premium Hotel",
        rating: 4,
        price: "$$$$",
        mapLink: "https://maps.google.com/?q=" + encodeURIComponent(destination + " hotels"),
      },
    ],
    cafes: [
      {
        name: "Local Café",
        district: "Center",
        specialty: "Coffee",
        mapLink: "https://maps.google.com/?q=" + encodeURIComponent(destination + " cafes"),
      },
    ],
    restaurants: [
      {
        name: "Local Restaurant",
        cuisine: "Local",
        district: "Downtown",
        mapLink: "https://maps.google.com/?q=" + encodeURIComponent(destination + " restaurants"),
      },
    ],
  }

  return {
    summary: `An amazing ${days}-day adventure in ${destination} featuring iconic landmarks, local cafes, and authentic experiences.`,
    coordinates: destInfo.coords,
    images: [],
    dailyItineraries: Array.from({ length: Math.min(days, 4) }).map((_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${["Arrival & City Overview", "Cultural Immersion", "Adventure & Exploration", "Local Experiences"][i]}`,
      description: "Explore the destination",
      activities: [
        {
          name: `Visit ${destInfo.landmarks[i % destInfo.landmarks.length]?.name || "landmark"}`,
          venue: destInfo.landmarks[i % destInfo.landmarks.length]?.name,
        },
        { name: "Local exploration", venue: "Downtown area" },
      ],
      meals: {
        breakfast: { venue: destInfo.cafes[0]?.name || "Local café", dish: "Local specialty" },
        lunch: {
          venue: destInfo.restaurants[i % destInfo.restaurants.length]?.name || "Local restaurant",
          dish: "Regional dish",
        },
        dinner: {
          venue: destInfo.restaurants[(i + 1) % destInfo.restaurants.length]?.name || "Local dining",
          dish: "Local cuisine",
        },
      },
      accommodation: { name: destInfo.hotels[0]?.name || "Hotel", area: "City center" },
    })),
    landmarks: destInfo.landmarks,
    hotels: destInfo.hotels,
    cafes: destInfo.cafes,
    restaurants: destInfo.restaurants,
    estimatedBudget: budget === "luxury" ? "$5,000+" : budget === "moderate" ? "$2,000-4,000" : "$800-1,500",
    packingTips: ["Comfortable walking shoes", "Universal adapter", "Camera for photos", "Travel insurance"],
    localTips: ["Use local transportation", "Try street food", "Visit during off-peak hours", "Learn basic phrases"],
  }
}
