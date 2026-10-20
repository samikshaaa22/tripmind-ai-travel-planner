"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

export default function SplashPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 -right-1/2 w-full h-full bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto gap-12">
        {/* Logo / Branding */}
        <div
          className={`transition-all duration-700 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <span className="text-2xl font-bold text-white">✈</span>
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">TripMind</h1>
          </div>
        </div>

        {/* Main Headline */}
        <div
          className={`text-center transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight mb-4">
            Your AI Travel
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Companion
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Generate personalized travel itineraries powered by advanced AI. From hidden gems to top attractions, we
            curate the perfect journey for you.
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={`transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          <Link href="/auth">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-foreground transition-all duration-300 hover:shadow-lg glow-primary hover:scale-105 active:scale-95">
              <span className="relative z-10">Start Planning Your Trip</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity" />
            </button>
          </Link>
        </div>

        {/* Features Grid */}
        <div
          className={`w-full transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.7s" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: "🎯",
                title: "Smart Planning",
                description: "AI learns your preferences for perfect trips",
              },
              {
                icon: "🗺️",
                title: "Real Data",
                description: "Integration with live location and reviews",
              },
              {
                icon: "💰",
                title: "Budget Friendly",
                description: "Optimize costs without compromising experience",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:border-primary/50"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </main>
  )
}
