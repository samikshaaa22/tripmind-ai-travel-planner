# TripMind — AI Travel Planner

TripMind is a travel-planning web application built with Next.js, React, TypeScript, and Tailwind CSS. It collects trip preferences and generates a suggested itinerary through a server-side API route.

## Tech stack
- Next.js and React
- TypeScript
- Tailwind CSS
- OpenAI API (optional; configured through an environment variable)
- Unsplash API (optional; configured through an environment variable)

## Getting started
1. Install Node.js and pnpm.
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your own API keys if you want live API functionality.
5. Start the development server with `pnpm dev`.

## Environment variables
- `OPENAI_API_KEY` — optional OpenAI API key for itinerary generation.
- `UNSPLASH_ACCESS_KEY` — optional Unsplash access key for destination images.

Never commit `.env.local` or any real API keys.

## Notes
This repository is a portfolio project. Authentication and persistence should be reviewed before treating the app as production-ready. Without API keys, some flows may return placeholder itinerary data.

## Run scripts
- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — start the production server
