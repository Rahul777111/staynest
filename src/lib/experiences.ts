// Experiences and Services seed data for StayNest.
// Experience hero photos are AI-generated and stored locally; service photos use Unsplash.

export type Experience = {
  id: string;
  title: string;
  location: string;
  category: string;
  price: number; // per person, USD
  duration: string;
  rating: number;
  reviews: number;
  groupSize: string;
  host: string;
  image: string;
  description: string;
};

export type Service = {
  id: string;
  title: string;
  category: string;
  provider: string;
  priceFrom: number;
  unit: string; // "per night", "per session"
  rating: number;
  reviews: number;
  image: string;
  description: string;
};

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-pasta-tuscany",
    title: "Make fresh pasta with a Tuscan nonna",
    location: "Val d'Orcia, Italy",
    category: "Food & drink",
    price: 78,
    duration: "3 hours",
    rating: 4.98,
    reviews: 412,
    groupSize: "Up to 8 guests",
    host: "Nonna Rosa",
    image: "/experiences/pasta.jpg",
    description:
      "Roll, cut and fill pasta by hand in a stone farmhouse kitchen, guided by a nonna who has done it every day for fifty years. Finish the afternoon at the table with everything you made and a glass of Chianti.",
  },
  {
    id: "exp-surf-bali",
    title: "Catch your first wave in Canggu",
    location: "Canggu, Bali",
    category: "Sports",
    price: 42,
    duration: "2 hours",
    rating: 4.92,
    reviews: 688,
    groupSize: "Up to 4 guests",
    host: "Komang",
    image: "/experiences/surf.jpg",
    description:
      "A patient, certified instructor gets you standing on a board in a single morning session on Bali's friendliest beach break. Boards, rash guards and reef-safe sunscreen included.",
  },
  {
    id: "exp-tokyo-night",
    title: "Neon night photo walk in Shibuya",
    location: "Tokyo, Japan",
    category: "Art & culture",
    price: 65,
    duration: "3 hours",
    rating: 4.95,
    reviews: 521,
    groupSize: "Up to 6 guests",
    host: "Kenji",
    image: "/experiences/tokyo.jpg",
    description:
      "A working street photographer leads you through Shibuya's glowing back alleys after dark, teaching you to shoot reflections, motion and neon. Bring any camera, even your phone.",
  },
  {
    id: "exp-wine-tuscany",
    title: "Private sunset wine tasting in the hills",
    location: "Chianti, Italy",
    category: "Food & drink",
    price: 95,
    duration: "2.5 hours",
    rating: 4.97,
    reviews: 296,
    groupSize: "Up to 10 guests",
    host: "Alessandro",
    image: "/experiences/wine.jpg",
    description:
      "Taste five estate wines on a vineyard terrace as the sun drops behind the Chianti hills, paired with local cheese and prosciutto and stories from a third-generation winemaker.",
  },
];

export const SERVICES: Service[] = [
  {
    id: "svc-chef",
    title: "Private chef dinner at your stay",
    category: "Chefs",
    provider: "Chef Mateo",
    priceFrom: 120,
    unit: "per guest",
    rating: 4.96,
    reviews: 184,
    image: img("photo-1556910103-1c02745aae4d"),
    description:
      "A trained chef shops, cooks a multi-course tasting menu in your kitchen, and leaves it spotless. Menus tailored to your group, from coastal seafood to a vegetarian feast.",
  },
  {
    id: "svc-photographer",
    title: "Vacation photo session",
    category: "Photography",
    provider: "Lucia Reyes",
    priceFrom: 180,
    unit: "per session",
    rating: 4.94,
    reviews: 132,
    image: img("photo-1452587925148-ce544e77e70d"),
    description:
      "A local photographer captures your trip at golden hour around the best nearby spots, then delivers 40+ edited photos within 48 hours.",
  },
  {
    id: "svc-massage",
    title: "In-stay spa & massage",
    category: "Wellness",
    provider: "Serene Touch",
    priceFrom: 90,
    unit: "per session",
    rating: 4.97,
    reviews: 211,
    image: img("photo-1544161515-4ab6ce6db874"),
    description:
      "A licensed therapist arrives with a table, oils and calm. Choose deep tissue, Swedish or a couples session, all in the comfort of your stay.",
  },
  {
    id: "svc-training",
    title: "Personal training & yoga",
    category: "Training",
    provider: "Coach Dani",
    priceFrom: 65,
    unit: "per session",
    rating: 4.91,
    reviews: 97,
    image: img("photo-1518611012118-696072aa579a"),
    description:
      "Keep your routine on the road with a private session, from a sunrise yoga flow on the terrace to a full strength workout. All equipment provided.",
  },
];

export function getExperience(id: string) {
  return EXPERIENCES.find((e) => e.id === id);
}
export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}
