// Seed listings for StayNest. Images use Unsplash (real photography, no key needed).

export type Listing = {
  id: string;
  title: string;
  location: string;
  country: string;
  type: string;
  price: number; // per night, USD
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  superhost: boolean;
  images: string[];
  amenities: string[];
  description: string;
  host: { name: string; since: string };
  lat: number;
  lng: number;
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const LISTINGS: Listing[] = [
  {
    id: "villa-amalfi",
    title: "Cliffside villa with infinity pool",
    location: "Amalfi Coast",
    country: "Italy",
    type: "Entire villa",
    price: 540,
    rating: 4.97,
    reviews: 128,
    guests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 3,
    superhost: true,
    images: [
      img("photo-1613490493576-7fde63acd811"),
      img("photo-1582268611958-ebfd161ef9cf"),
      img("photo-1512917774080-9991f1c4c750"),
    ],
    amenities: ["Infinity pool", "Sea view", "WiFi", "Kitchen", "Air conditioning", "Free parking"],
    description:
      "Wake up to the Tyrrhenian Sea from a glass-walled villa carved into the Amalfi cliffs. Sun-drenched terraces, a heated infinity pool, and a chef's kitchen make this the place to slow down.",
    host: { name: "Giulia", since: "2017" },
    lat: 40.634,
    lng: 14.602,
  },
  {
    id: "cabin-aspen",
    title: "Hygge cabin by the snowy pines",
    location: "Aspen, Colorado",
    country: "United States",
    type: "Entire cabin",
    price: 320,
    rating: 4.91,
    reviews: 204,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    superhost: true,
    images: [
      "/listings/cabin.jpg",
      img("photo-1449158743715-0a90ebb6d2d8"),
      img("photo-1517320964276-a002fa203177"),
    ],
    amenities: ["Fireplace", "Hot tub", "WiFi", "Kitchen", "Ski-in/out", "Heating"],
    description:
      "A warm timber cabin wrapped in snow-dusted pines. Curl up by the stone fireplace, soak in the hot tub under the stars, and ski straight from the door.",
    host: { name: "Mason", since: "2019" },
    lat: 39.191,
    lng: -106.817,
  },
  {
    id: "loft-tokyo",
    title: "Minimal loft in Shibuya",
    location: "Tokyo",
    country: "Japan",
    type: "Entire loft",
    price: 185,
    rating: 4.88,
    reviews: 356,
    guests: 3,
    bedrooms: 1,
    beds: 2,
    baths: 1,
    superhost: false,
    images: [
      img("photo-1522708323590-d24dbb6b0267"),
      img("photo-1505693416388-ac5ce068fe85"),
      img("photo-1540518614846-7eded433c457"),
    ],
    amenities: ["City view", "WiFi", "Workspace", "Kitchen", "Washer", "Self check-in"],
    description:
      "A serene, light-filled loft minutes from Shibuya crossing. Floor-to-ceiling windows, a quiet workspace, and everything within a short walk.",
    host: { name: "Haruki", since: "2018" },
    lat: 35.658,
    lng: 139.701,
  },
  {
    id: "riad-marrakech",
    title: "Traditional riad with courtyard",
    location: "Marrakech",
    country: "Morocco",
    type: "Entire riad",
    price: 142,
    rating: 4.94,
    reviews: 189,
    guests: 5,
    bedrooms: 2,
    beds: 3,
    baths: 2,
    superhost: true,
    images: [
      img("photo-1539020140153-e479b8c22e70"),
      img("photo-1571003123894-1f0594d2b5d9"),
      img("photo-1578683010236-d716f9a3f461"),
    ],
    amenities: ["Courtyard", "Plunge pool", "WiFi", "Rooftop terrace", "Breakfast", "AC"],
    description:
      "Step off the souk into a tiled oasis. This restored riad centers on a tranquil courtyard with a plunge pool and a rooftop terrace for mint tea at sunset.",
    host: { name: "Yasmine", since: "2016" },
    lat: 31.629,
    lng: -7.989,
  },
  {
    id: "beach-bali",
    title: "Open-air bungalow steps from the sand",
    location: "Canggu, Bali",
    country: "Indonesia",
    type: "Entire bungalow",
    price: 98,
    rating: 4.85,
    reviews: 421,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    superhost: false,
    images: [
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1571896349842-33c89424de2d"),
      img("photo-1582719478250-c89cae4dc85b"),
    ],
    amenities: ["Beachfront", "Outdoor shower", "WiFi", "Scooter", "Breakfast", "Garden"],
    description:
      "A breezy bamboo bungalow a barefoot walk from the surf. Open-air living, a private garden shower, and sunsets that empty your inbox.",
    host: { name: "Wayan", since: "2020" },
    lat: -8.648,
    lng: 115.137,
  },
  {
    id: "penthouse-nyc",
    title: "Skyline penthouse in SoHo",
    location: "New York",
    country: "United States",
    type: "Entire apartment",
    price: 410,
    rating: 4.89,
    reviews: 142,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    superhost: true,
    images: [
      img("photo-1502672260266-1c1ef2d93688"),
      img("photo-1560448204-e02f11c3d0e2"),
      img("photo-1556912172-45b7abe8b7e1"),
    ],
    amenities: ["Skyline view", "Elevator", "WiFi", "Gym", "Doorman", "Workspace"],
    description:
      "Floor-to-ceiling glass over the SoHo rooftops. Designer interiors, a private terrace, and the whole city at your feet.",
    host: { name: "Olivia", since: "2015" },
    lat: 40.723,
    lng: -74.002,
  },
  {
    id: "treehouse-oregon",
    title: "Treehouse retreat in the redwoods",
    location: "Portland, Oregon",
    country: "United States",
    type: "Treehouse",
    price: 215,
    rating: 4.96,
    reviews: 98,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    superhost: true,
    images: [
      img("photo-1488462237308-ecaa28b729d7"),
      img("photo-1518780664697-55e3ad937233"),
      img("photo-1505691938895-1758d7feb511"),
    ],
    amenities: ["Forest view", "Skylight", "WiFi", "Wood stove", "Hammock", "Coffee"],
    description:
      "Sleep among the canopy in a hand-built treehouse. A skylight over the bed, a wood stove for cold nights, and birdsong for an alarm clock.",
    host: { name: "Ethan", since: "2019" },
    lat: 45.523,
    lng: -122.676,
  },
  {
    id: "lake-queenstown",
    title: "Lakefront chalet with mountain views",
    location: "Queenstown",
    country: "New Zealand",
    type: "Entire chalet",
    price: 275,
    rating: 4.93,
    reviews: 167,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    superhost: false,
    images: [
      img("photo-1499793983690-e29da59ef1c2"),
      img("photo-1518733057094-95b53143d2a7"),
      img("photo-1469022563428-aa04fef9f5a2"),
    ],
    amenities: ["Lake view", "Fireplace", "WiFi", "Kayaks", "Kitchen", "Free parking"],
    description:
      "A timber chalet on the edge of Lake Wakatipu with the Remarkables towering behind. Kayak at dawn, grill at dusk, and watch the alpenglow from the deck.",
    host: { name: "Charlotte", since: "2018" },
    lat: -45.031,
    lng: 168.662,
  },
];

export function getListing(id: string) {
  return LISTINGS.find((l) => l.id === id);
}
