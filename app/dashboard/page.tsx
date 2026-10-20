"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Plus, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import TripForm from "@/components/trip/trip-form"
import TripDisplay from "@/components/trip/trip-display"
import TripHistory from "@/components/trip/trip-history"

type ViewMode = "form" | "history" | "display"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("history")
  const [currentTrip, setCurrentTrip] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("currentTrip")
    router.push("/")
  }

  const handleTripSubmit = (tripData: any) => {
    setCurrentTrip(tripData)
    setViewMode("display")
  }

  const handleViewTrip = (tripData: any) => {
    setCurrentTrip(tripData)
    setViewMode("display")
  }

  const handleNewTrip = () => {
    setViewMode("form")
  }

  const handleBack = () => {
    setCurrentTrip(null)
    setViewMode("history")
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name || "Traveler"}!</h1>
            <p className="text-muted-foreground">Plan your next adventure with TripMind AI</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-3 mb-8 border-b border-border">
          <button
            onClick={() => setViewMode("history")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              viewMode === "history"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            My Trips
          </button>
          <button
            onClick={handleNewTrip}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              viewMode === "form"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>

        {/* Main content */}
        {viewMode === "form" && <TripForm onTripSubmit={handleTripSubmit} />}
        {viewMode === "history" && <TripHistory onViewTrip={handleViewTrip} />}
        {viewMode === "display" && currentTrip && <TripDisplay tripData={currentTrip} onBack={handleBack} />}
      </div>
    </main>
  )
}
