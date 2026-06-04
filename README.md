# StayNest — Find your next stay

**Live demo: [staynest-two.vercel.app](https://staynest-two.vercel.app)**

A full-stack Airbnb-style booking app. Browse unique stays around the world, search and filter, open a rich listing page, pick your dates, and book. Confirmed trips are saved and shown in My Trips.

![Tech](https://img.shields.io/badge/Next.js-16-ff385c) ![Tech](https://img.shields.io/badge/API%20Routes-server-black) ![Tech](https://img.shields.io/badge/Motion-animation-purple)

## Features

- **Search and filter** — by destination, guest count, and max price, served by an API route.
- **Listing pages** — image gallery, host info, amenities, and a sticky booking widget.
- **Working booking flow** — date pickers and guest selection with a live price breakdown (nightly, cleaning, service fee, total); the server validates dates and guest limits and returns a confirmation.
- **My Trips** — confirmed bookings persist locally and can be cancelled.
- Eight curated stays (villa, cabin, loft, riad, bungalow, penthouse, treehouse, chalet) with real photography.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · API Routes · Motion · Phosphor Icons

## Getting started

```bash
npm install
npm run dev
npm run build && npm start
```

## Architecture

Listings are server-side seed data exposed through `GET /api/listings` and `GET /api/listing/[id]`. Bookings are validated and priced by `POST /api/book`, and confirmations are stored client-side as the user's trips.

## Author

**D L Narayana** — [GitHub](https://github.com/Rahul777111)
