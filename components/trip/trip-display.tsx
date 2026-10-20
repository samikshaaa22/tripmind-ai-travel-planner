"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, AlertCircle, MapPin, Hotel, Coffee, UtensilsCrossed } from "lucide-react"

interface TripItinerary {
  summary: string
  coordinates: { lat: number; lng: number }
  images: string[]
  dailyItineraries: Array<{
    day: number
    title: string
    description?: string
    activities: Array<{ name: string; venue: string }>
    meals?: {
      breakfast: { venue: string; dish: string }
      lunch: { venue: string; dish: string }
      dinner: { venue: string; dish: string }
    }
    accommodation?: { name: string; area: string }
  }>
  landmarks: Array<{ name: string; address: string; mapLink: string }>
  hotels: Array<{ name: string; rating: number; price: string; mapLink: string }>
  cafes: Array<{ name: string; district: string; specialty: string; mapLink: string }>
  restaurants: Array<{ name: string; cuisine: string; district: string; mapLink: string }>
  estimatedBudget: string
  packingTips: string[]
  localTips: string[]
}

interface TripDisplayProps {
  tripData: any
  onBack: () => void
}

export default function TripDisplay({ tripData, onBack }: TripDisplayProps) {
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("itinerary")

  useEffect(() => {
    const generateItinerary = async () => {
      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination: tripData.destination,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            travelers: tripData.travelers,
            budget: tripData.budget,
            interests: tripData.interests,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate itinerary")
        }

        const data = await response.json()
        setItinerary(data)
        setActiveTab("itinerary")
      } catch (err) {
        console.error("Error generating itinerary:", err)
        setError("Failed to generate itinerary. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    generateItinerary()
  }, [tripData])

  const handleDownload = () => {
    const dataStr = JSON.stringify(itinerary, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${tripData.destination}-itinerary.json`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <p className="text-foreground font-semibold">Generating your personalized itinerary...</p>
        <p className="text-muted-foreground text-sm mt-2">This may take a moment</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Error Generating Itinerary</h3>
        </div>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onBack} variant="outline" className="bg-transparent">
          Go Back
        </Button>
      </div>
    )
  }

  if (!itinerary) {
    return null
  }

  const durationDays = Math.ceil(
    (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Planning
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {itinerary.images && itinerary.images.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden h-96">
          <img
            src={itinerary.images[0] || "/placeholder.svg"}
            alt={tripData.destination}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {["itinerary", "landmarks", "hotels", "cafes", "restaurants"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold text-sm transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Trip Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your {tripData.destination} Itinerary</h1>
        <p className="text-muted-foreground mb-4">{itinerary.summary}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
          <div>
            <p className="text-muted-foreground mb-1">Duration</p>
            <p className="font-semibold text-foreground">{durationDays} days</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Travelers</p>
            <p className="font-semibold text-foreground">{tripData.travelers} person(s)</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Budget</p>
            <p className="font-semibold text-foreground capitalize">{tripData.budget}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Estimated Cost</p>
            <p className="font-semibold text-foreground">{itinerary.estimatedBudget}</p>
          </div>
        </div>
      </div>

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Day-by-Day Plan</h2>
          {itinerary.dailyItineraries.map((day) => (
            <div
              key={day.day}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                Day {day.day}: {day.title}
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Activities
                  </h4>
                  <ul className="space-y-2">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <div>
                          <p>{activity.name}</p>
                          <p className="text-xs text-foreground font-medium">{activity.venue}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {day.meals && (
                  <div className="bg-muted/30 rounded p-4">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-accent" />
                      Meals
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Breakfast</p>
                        <p className="font-medium text-foreground">{day.meals.breakfast.venue}</p>
                        <p className="text-xs text-muted-foreground">{day.meals.breakfast.dish}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lunch</p>
                        <p className="font-medium text-foreground">{day.meals.lunch.venue}</p>
                        <p className="text-xs text-muted-foreground">{day.meals.lunch.dish}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dinner</p>
                        <p className="font-medium text-foreground">{day.meals.dinner.venue}</p>
                        <p className="text-xs text-muted-foreground">{day.meals.dinner.dish}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {day.accommodation && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{day.accommodation.name}</span> in{" "}
                  {day.accommodation.area}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Landmarks Tab */}
      {activeTab === "landmarks" && (
        <div className="grid md:grid-cols-2 gap-4">
          {itinerary.landmarks.map((landmark, idx) => (
            <a
              key={idx}
              href={landmark.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {landmark.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{landmark.address}</p>
                  <p className="text-xs text-primary mt-2">View on Google Maps</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === "hotels" && (
        <div className="grid md:grid-cols-2 gap-4">
          {itinerary.hotels.map((hotel, idx) => (
            <a
              key={idx}
              href={hotel.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-accent">{"★".repeat(hotel.rating)}</span>
                    <span className="text-sm text-muted-foreground">{hotel.price}</span>
                  </div>
                </div>
                <Hotel className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Cafes Tab */}
      {activeTab === "cafes" && (
        <div className="grid md:grid-cols-2 gap-4">
          {itinerary.cafes.map((cafe, idx) => (
            <a
              key={idx}
              href={cafe.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <Coffee className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cafe.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{cafe.district}</p>
                  <p className="text-xs text-accent mt-2">{cafe.specialty}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Restaurants Tab */}
      {activeTab === "restaurants" && (
        <div className="grid md:grid-cols-2 gap-4">
          {itinerary.restaurants.map((restaurant, idx) => (
            <a
              key={idx}
              href={restaurant.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{restaurant.district}</p>
                  <p className="text-xs text-accent mt-2">{restaurant.cuisine}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Additional Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Packing Tips</h3>
          <ul className="space-y-2">
            {itinerary.packingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Local Tips</h3>
          <ul className="space-y-2">
            {itinerary.localTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-accent font-bold mt-0.5">◆</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
