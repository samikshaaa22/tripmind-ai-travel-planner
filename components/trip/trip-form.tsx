"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Users, Sparkles, DollarSign } from "lucide-react"

interface TripFormProps {
  onTripSubmit: (tripData: any) => void
}

export default function TripForm({ onTripSubmit }: TripFormProps) {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [travelers, setTravelers] = useState("1")
  const [budget, setBudget] = useState("moderate")
  const [interests, setInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const interestOptions = [
    "Adventure",
    "Culture",
    "Food",
    "Nature",
    "History",
    "Nightlife",
    "Relaxation",
    "Shopping",
    "Photography",
    "Art",
  ]

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!destination || !startDate || !endDate) {
        throw new Error("Please fill in all required fields")
      }

      const tripData = {
        destination,
        startDate,
        endDate,
        travelers: Number.parseInt(travelers),
        budget,
        interests,
        createdAt: new Date().toISOString(),
      }

      // Store trip data in localStorage
      const trips = JSON.parse(localStorage.getItem("trips") || "[]")
      trips.push(tripData)
      localStorage.setItem("trips", JSON.stringify(trips))

      // Store current trip for display
      localStorage.setItem("currentTrip", JSON.stringify(tripData))

      onTripSubmit(tripData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Plan Your Trip
        </h2>

        {/* Destination */}
        <div className="mb-6">
          <label htmlFor="destination" className="block text-sm font-medium text-foreground mb-2">
            Destination *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="destination"
              type="text"
              placeholder="e.g., Paris, Tokyo, Bali"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-foreground mb-2">
              Start Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-foreground mb-2">
              End Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Travelers and Budget */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="travelers" className="block text-sm font-medium text-foreground mb-2">
              Number of Travelers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="travelers"
                type="number"
                min="1"
                max="20"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
              Budget Range
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isLoading}
                className="pl-10 w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="budget">Budget-Friendly</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">What are you interested in?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                  interests.includes(interest)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">{error}</div>}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-foreground font-semibold group"
        >
          {isLoading ? "Generating your itinerary..." : "Generate Itinerary"}
          <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform ml-2" />
        </Button>
      </div>
    </form>
  )
}
