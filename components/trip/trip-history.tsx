"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Trash2, Eye } from "lucide-react"

interface Trip {
  destination: string
  startDate: string
  endDate: string
  travelers: number
  budget: string
  interests: string[]
  createdAt: string
}

interface TripHistoryProps {
  onViewTrip: (trip: Trip) => void
}

export default function TripHistory({ onViewTrip }: TripHistoryProps) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load trips from localStorage
    const savedTrips = localStorage.getItem("trips")
    if (savedTrips) {
      try {
        const parsedTrips = JSON.parse(savedTrips)
        setTrips(parsedTrips.reverse()) // Show newest first
      } catch {
        setTrips([])
      }
    }
    setIsLoading(false)
  }, [])

  const handleDelete = (index: number) => {
    const updatedTrips = trips.filter((_, i) => i !== index)
    setTrips(updatedTrips)
    localStorage.setItem("trips", JSON.stringify(updatedTrips.reverse()))
  }

  const getDurationDays = (start: string, end: string) => {
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading your trips...</p>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No trips yet</h3>
        <p className="text-muted-foreground mb-6">Start planning your first adventure with TripMind AI!</p>
        {/* Navigation is handled by parent component */}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Travel History</h2>
        <p className="text-sm text-muted-foreground">{trips.length} trip(s) planned</p>
      </div>

      <div className="grid gap-4">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">{trip.destination}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{getDurationDays(trip.startDate, trip.endDate)}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{trip.travelers} traveler(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium px-2 py-1 rounded bg-primary/10 text-primary capitalize">
                  {trip.budget}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Interests</p>
                <p className="text-sm text-foreground">{trip.interests.length} selected</p>
              </div>
            </div>

            {trip.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {trip.interests.slice(0, 3).map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                  >
                    {interest}
                  </span>
                ))}
                {trip.interests.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    +{trip.interests.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => onViewTrip(trip)}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 bg-transparent"
              >
                <Eye className="w-4 h-4" />
                View Itinerary
              </Button>
              <Button
                onClick={() => handleDelete(index)}
                variant="outline"
                className="px-4 bg-transparent text-destructive hover:bg-destructive/10 hover:border-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
