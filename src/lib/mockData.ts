import type { Book } from "@/lib/books";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

const MOCK_BOOKS: Book[] = [
  {
    id: "mock-1",
    title: "The Night Watchman's Daughter",
    author: "Elena Marchetti",
    price: 24.99,
    genre: "Literary Fiction",
    coverColor: "linear-gradient(135deg, oklch(0.45 0.1 25), oklch(0.32 0.08 30))",
    rating: 4.8,
    description: "Author: Elena Marchetti. A luminous debut about memory, exile, and the letters we never send.",
    publishedYear: 2024,
    stock: 10,
  },
  {
    id: "mock-2",
    title: "Salt & Cedar",
    author: "James Whitmore",
    price: 18.5,
    genre: "Poetry",
    coverColor: "linear-gradient(135deg, oklch(0.52 0.06 155), oklch(0.38 0.05 160))",
    rating: 4.6,
    description: "Author: James Whitmore. Coastal verses that taste of rain and unfinished prayers.",
    publishedYear: 2023,
    stock: 10,
  },
  {
    id: "mock-3",
    title: "A Brief History of Attics",
    author: "Sofia Lindqvist",
    price: 29,
    genre: "Essays",
    coverColor: "linear-gradient(135deg, oklch(0.55 0.08 85), oklch(0.4 0.06 70))",
    rating: 4.9,
    description: "Author: Sofia Lindqvist. Essays on dust, inheritance, and the rooms we inherit without choosing.",
    publishedYear: 2022,
    stock: 10,
  },
  {
    id: "mock-4",
    title: "Violet Hour in Lisbon",
    author: "Marco Alves",
    price: 22,
    genre: "Literary Fiction",
    coverColor: "linear-gradient(135deg, oklch(0.5 0.14 300), oklch(0.35 0.1 280))",
    rating: 4.5,
    description: "Author: Marco Alves. Two strangers share a bench as the city exhales into evening.",
    publishedYear: 2021,
    stock: 10,
  },
  {
    id: "mock-5",
    title: "Cartography for the Lonely",
    author: "Amira Hassan",
    price: 19.99,
    genre: "Poetry",
    coverColor: "linear-gradient(135deg, oklch(0.48 0.12 45), oklch(0.3 0.08 40))",
    rating: 4.7,
    description: "Author: Amira Hassan. Maps drawn in metaphor for those navigating distance.",
    publishedYear: 2024,
    stock: 10,
  },
  {
    id: "mock-6",
    title: "The Archivist's Silence",
    author: "Henry Croft",
    price: 26.5,
    genre: "Mystery",
    coverColor: "linear-gradient(135deg, oklch(0.35 0.03 50), oklch(0.22 0.03 50))",
    rating: 4.4,
    description: "Author: Henry Croft. A missing folio unravels a century of family secrets.",
    publishedYear: 2020,
    stock: 10,
  },
  {
    id: "mock-7",
    title: "Winter Letters",
    author: "Claire O'Donnell",
    price: 21,
    genre: "Literary Fiction",
    coverColor: "linear-gradient(135deg, oklch(0.6 0.04 250), oklch(0.45 0.05 260))",
    rating: 4.6,
    description: "Author: Claire O'Donnell. Correspondence across decades stitches a fractured sisterhood.",
    publishedYear: 2019,
    stock: 10,
  },
  {
    id: "mock-8",
    title: "On Stillness",
    author: "Yuki Tanaka",
    price: 16.99,
    genre: "Philosophy",
    coverColor: "linear-gradient(135deg, oklch(0.7 0.02 85), oklch(0.55 0.03 70))",
    rating: 4.3,
    description: "Author: Yuki Tanaka. Meditations for readers who measure time in tea and turning pages.",
    publishedYear: 2023,
    stock: 10,
  },
  {
    id: "mock-9",
    title: "Gardens of the Unsaid",
    author: "Isabel Romero",
    price: 23.5,
    genre: "Literary Fiction",
    coverColor: "linear-gradient(135deg, oklch(0.55 0.1 145), oklch(0.4 0.08 150))",
    rating: 4.8,
    description: "Author: Isabel Romero. A gardener tends words as carefully as heirloom roses.",
    publishedYear: 2022,
    stock: 10,
  },
  {
    id: "mock-10",
    title: "The Last Lighthouse Keeper",
    author: "Thomas Byrne",
    price: 27,
    genre: "Historical Fiction",
    coverColor: "linear-gradient(135deg, oklch(0.42 0.08 240), oklch(0.28 0.06 250))",
    rating: 4.5,
    description: "Author: Thomas Byrne. Storm seasons and solitude on a cliff at the edge of the world.",
    publishedYear: 2018,
    stock: 10,
  },
  {
    id: "mock-11",
    title: "Feather & Ink",
    author: "Nadia Petrov",
    price: 17.5,
    genre: "Poetry",
    coverColor: "linear-gradient(135deg, oklch(0.65 0.1 85), oklch(0.5 0.08 75))",
    rating: 4.2,
    description: "Author: Nadia Petrov. Lyric fragments from a life lived between languages.",
    publishedYear: 2021,
    stock: 10,
  },
  {
    id: "mock-12",
    title: "Small Mercies",
    author: "David Okonkwo",
    price: 20,
    genre: "Short Stories",
    coverColor: "linear-gradient(135deg, oklch(0.5 0.12 25), oklch(0.38 0.1 20))",
    rating: 4.7,
    description: "Author: David Okonkwo. Twelve stories of grace found in ordinary rooms.",
    publishedYear: 2024,
    stock: 10,
  },
  {
    id: "mock-13",
    title: "Paper Moons",
    author: "Lily Chen",
    price: 25,
    genre: "Literary Fiction",
    coverColor: "linear-gradient(135deg, oklch(0.58 0.06 320), oklch(0.42 0.05 310))",
    rating: 4.6,
    description: "Author: Lily Chen. Childhood myths survive into adulthood with surprising teeth.",
    publishedYear: 2023,
    stock: 10,
  },
  {
    id: "mock-14",
    title: "The Margins We Keep",
    author: "Ruth Kaplan",
    price: 22.99,
    genre: "Essays",
    coverColor: "linear-gradient(135deg, oklch(0.48 0.04 70), oklch(0.35 0.03 60))",
    rating: 4.9,
    description: "Author: Ruth Kaplan. Notes from the edges of manuscripts and marriages.",
    publishedYear: 2022,
    stock: 10,
  },
  {
    id: "mock-15",
    title: "Echoes in the Stacks",
    author: "Various Authors",
    price: 15,
    genre: "Anthology",
    coverColor: "linear-gradient(135deg, oklch(0.4 0.05 50), oklch(0.28 0.04 45))",
    rating: 4.1,
    description: "A chorus of voices celebrating the romance of public libraries.",
    publishedYear: 2020,
    stock: 10,
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Folio feels like stepping into a reading room where every spine was chosen with care.",
    author: "Margaret Ellis",
    role: "Member since 2022",
  },
  {
    id: "t2",
    quote:
      "The curated selections introduced me to authors I would never have found alone.",
    author: "Daniel Reeves",
    role: "Poetry enthusiast",
  },
  {
    id: "t3",
    quote:
      "Beautiful packaging, thoughtful recommendations, and staff who actually read.",
    author: "Priya Nair",
    role: "Book club organizer",
  },
  {
    id: "t4",
    quote:
      "My weekly ritual: tea, a window seat, and whatever Folio has set aside for me.",
    author: "Helena Voss",
    role: "Literary fiction reader",
  },
];

export function getMockBooks(): Book[] {
  return [...MOCK_BOOKS];
}

export function getFeaturedMockBooks(count = 4): Book[] {
  return MOCK_BOOKS.slice(0, count);
}

export function getMockGenres(): string[] {
  const genres = new Set(MOCK_BOOKS.map((b) => b.genre));
  return Array.from(genres).sort();
}
