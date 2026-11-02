export type Fulfilment = "made-to-order" | "ready-to-ship";

export interface Artist {
  slug: string;
  name: string;
  artform: string;
  state: string;
  joined: number;
  bio: string;
  verified: boolean;
}

export interface Artwork {
  handle: string;
  title: string;
  artistSlug: string;
  artform: string;
  state: string;
  medium: string;
  width: number; // inches
  height: number;
  price: number; // INR
  compareAt?: number;
  fulfilment: Fulfilment;
  makingDays: string;
  rooms: string[];
  collections: string[];
  palette: [string, string, string];
  motif: "mandala" | "waves" | "fish" | "tree" | "lotus" | "geometric" | "sun" | "peacock";
  soldOut?: boolean;
  badge?: string;
  description: string;
}

export const artists: Artist[] = [
  { slug: "meera-devi", name: "Meera Devi", artform: "Madhubani", state: "Bihar", joined: 2019, bio: "Third-generation Madhubani painter known for fine line work and natural pigments.", verified: true },
  { slug: "ravi-chitrakar", name: "Ravi Chitrakar", artform: "Pattachitra", state: "Odisha", joined: 2018, bio: "Scroll painter from Raghurajpur whose temple narratives are painted on treated cloth.", verified: true },
  { slug: "sunita-bhil", name: "Sunita Bhil", artform: "Gond", state: "Madhya Pradesh", joined: 2020, bio: "Gond artist who paints forest spirits with dense dotted patterns.", verified: true },
  { slug: "arjun-warli", name: "Arjun Warli", artform: "Warli", state: "Maharashtra", joined: 2021, bio: "Warli painter translating harvest rituals into rhythmic white-on-earth compositions.", verified: true },
  { slug: "lakshmi-nair", name: "Lakshmi Nair", artform: "Kerala Mural", state: "Kerala", joined: 2017, bio: "Mural artist trained in the classical Kerala palette of five natural colours.", verified: true },
  { slug: "imran-khan", name: "Imran Khan", artform: "Miniature", state: "Rajasthan", joined: 2016, bio: "Court-style miniature painter working with stone pigments and gold leaf.", verified: true },
  { slug: "kavita-sharma", name: "Kavita Sharma", artform: "Phad", state: "Rajasthan", joined: 2022, bio: "Phad scroll painter reviving epic storytelling on cotton canvas.", verified: false },
  { slug: "tashi-dorje", name: "Tashi Dorje", artform: "Thangka", state: "Ladakh", joined: 2019, bio: "Thangka painter whose compositions follow traditional iconometric grids.", verified: true },
];

type Seed = Omit<Artwork, "description" | "palette">;

const palettes: Artwork["palette"][] = [
  ["#44153F", "#F0C330", "#F0E6D8"],
  ["#1F3A3D", "#E07A5F", "#F4F1DE"],
  ["#744379", "#F2CC8F", "#FDF6EC"],
  ["#2B2D42", "#EF8354", "#EDF2F4"],
  ["#3D405B", "#81B29A", "#F4F1DE"],
  ["#6A040F", "#FAA307", "#FFF3E0"],
];

const seeds: Seed[] = [
  { handle: "tree-of-life-madhubani", title: "Tree of Life", artistSlug: "meera-devi", artform: "Madhubani", state: "Bihar", medium: "Natural pigments on handmade paper", width: 22, height: 30, price: 18500, compareAt: 21500, fulfilment: "made-to-order", makingDays: "3–4 weeks", rooms: ["Living Room", "Bedroom"], collections: ["bestsellers", "nature"], motif: "tree", badge: "Editor's pick" },
  { handle: "fish-pair-madhubani", title: "Pair of Fish", artistSlug: "meera-devi", artform: "Madhubani", state: "Bihar", medium: "Natural pigments on paper", width: 15, height: 22, price: 6200, fulfilment: "ready-to-ship", makingDays: "Ships in 3 days", rooms: ["Dining Room", "Study"], collections: ["nature"], motif: "fish" },
  { handle: "peacock-dance-madhubani", title: "Peacock Dance", artistSlug: "meera-devi", artform: "Madhubani", state: "Bihar", medium: "Acrylic on canvas", width: 24, height: 36, price: 28000, compareAt: 32000, fulfilment: "made-to-order", makingDays: "4–5 weeks", rooms: ["Living Room"], collections: ["bestsellers", "statement"], motif: "peacock" },
  { handle: "sun-temple-pattachitra", title: "Sun Temple Narrative", artistSlug: "ravi-chitrakar", artform: "Pattachitra", state: "Odisha", medium: "Natural colours on treated cloth", width: 18, height: 24, price: 14500, fulfilment: "made-to-order", makingDays: "3–4 weeks", rooms: ["Living Room", "Pooja Room"], collections: ["heritage"], motif: "sun" },
  { handle: "lotus-pond-pattachitra", title: "Lotus Pond", artistSlug: "ravi-chitrakar", artform: "Pattachitra", state: "Odisha", medium: "Natural colours on cloth", width: 12, height: 16, price: 4800, compareAt: 5600, fulfilment: "ready-to-ship", makingDays: "Ships in 3 days", rooms: ["Bedroom", "Study"], collections: ["under-5k", "nature"], motif: "lotus" },
  { handle: "forest-spirit-gond", title: "Forest Spirit", artistSlug: "sunita-bhil", artform: "Gond", state: "Madhya Pradesh", medium: "Acrylic on canvas", width: 20, height: 28, price: 12800, fulfilment: "made-to-order", makingDays: "3 weeks", rooms: ["Living Room", "Office"], collections: ["statement", "nature"], motif: "tree", badge: "New" },
  { handle: "dotted-deer-gond", title: "Dotted Deer", artistSlug: "sunita-bhil", artform: "Gond", state: "Madhya Pradesh", medium: "Acrylic on paper", width: 12, height: 12, price: 3400, fulfilment: "ready-to-ship", makingDays: "Ships in 2 days", rooms: ["Study", "Bedroom"], collections: ["under-5k", "gifting"], motif: "geometric" },
  { handle: "harvest-circle-warli", title: "Harvest Circle", artistSlug: "arjun-warli", artform: "Warli", state: "Maharashtra", medium: "Rice paste on earthen canvas", width: 24, height: 24, price: 9800, compareAt: 11500, fulfilment: "made-to-order", makingDays: "2–3 weeks", rooms: ["Living Room", "Dining Room"], collections: ["bestsellers", "heritage"], motif: "mandala" },
  { handle: "village-life-warli", title: "Village Life", artistSlug: "arjun-warli", artform: "Warli", state: "Maharashtra", medium: "Acrylic on canvas", width: 18, height: 18, price: 5200, fulfilment: "ready-to-ship", makingDays: "Ships in 3 days", rooms: ["Bedroom", "Study"], collections: ["gifting"], motif: "geometric" },
  { handle: "kerala-krishna-mural", title: "Krishna with Flute", artistSlug: "lakshmi-nair", artform: "Kerala Mural", state: "Kerala", medium: "Natural pigments on board", width: 24, height: 32, price: 42000, compareAt: 48000, fulfilment: "made-to-order", makingDays: "6–8 weeks", rooms: ["Pooja Room", "Living Room"], collections: ["statement", "heritage"], motif: "sun", badge: "Editor's pick" },
  { handle: "elephant-procession-mural", title: "Elephant Procession", artistSlug: "lakshmi-nair", artform: "Kerala Mural", state: "Kerala", medium: "Natural pigments on board", width: 18, height: 24, price: 26500, fulfilment: "made-to-order", makingDays: "5–6 weeks", rooms: ["Living Room", "Office"], collections: ["statement"], motif: "waves", soldOut: true },
  { handle: "royal-garden-miniature", title: "Royal Garden", artistSlug: "imran-khan", artform: "Miniature", state: "Rajasthan", medium: "Stone pigments and gold leaf on paper", width: 10, height: 14, price: 22000, fulfilment: "made-to-order", makingDays: "5–6 weeks", rooms: ["Study", "Living Room"], collections: ["heritage", "statement"], motif: "lotus" },
  { handle: "court-musicians-miniature", title: "Court Musicians", artistSlug: "imran-khan", artform: "Miniature", state: "Rajasthan", medium: "Stone pigments on paper", width: 8, height: 10, price: 9500, compareAt: 10500, fulfilment: "ready-to-ship", makingDays: "Ships in 4 days", rooms: ["Study", "Bedroom"], collections: ["gifting"], motif: "peacock" },
  { handle: "pabuji-phad-scroll", title: "Pabuji Phad Panel", artistSlug: "kavita-sharma", artform: "Phad", state: "Rajasthan", medium: "Natural colours on cotton", width: 20, height: 30, price: 16800, fulfilment: "made-to-order", makingDays: "4 weeks", rooms: ["Living Room", "Office"], collections: ["heritage"], motif: "waves" },
  { handle: "green-tara-thangka", title: "Green Tara", artistSlug: "tashi-dorje", artform: "Thangka", state: "Ladakh", medium: "Mineral pigments and gold on cotton", width: 16, height: 22, price: 54000, compareAt: 60000, fulfilment: "made-to-order", makingDays: "8–10 weeks", rooms: ["Pooja Room", "Living Room"], collections: ["statement", "heritage"], motif: "mandala", badge: "Rare" },
  { handle: "mandala-bloom-thangka", title: "Mandala Bloom", artistSlug: "tashi-dorje", artform: "Thangka", state: "Ladakh", medium: "Mineral pigments on cotton", width: 12, height: 12, price: 7800, fulfilment: "ready-to-ship", makingDays: "Ships in 3 days", rooms: ["Study", "Pooja Room"], collections: ["gifting"], motif: "mandala" },
  { handle: "peacock-pair-gond", title: "Peacock Pair", artistSlug: "sunita-bhil", artform: "Gond", state: "Madhya Pradesh", medium: "Acrylic on canvas", width: 16, height: 20, price: 8200, fulfilment: "ready-to-ship", makingDays: "Ships in 3 days", rooms: ["Dining Room", "Bedroom"], collections: ["nature"], motif: "peacock" },
  { handle: "monsoon-waves-warli", title: "Monsoon Waves", artistSlug: "arjun-warli", artform: "Warli", state: "Maharashtra", medium: "Acrylic on canvas", width: 30, height: 20, price: 13400, fulfilment: "made-to-order", makingDays: "3 weeks", rooms: ["Living Room", "Office"], collections: ["statement", "nature"], motif: "waves" },
  { handle: "sunrise-madhubani", title: "Sunrise Ritual", artistSlug: "meera-devi", artform: "Madhubani", state: "Bihar", medium: "Natural pigments on paper", width: 12, height: 16, price: 4200, fulfilment: "ready-to-ship", makingDays: "Ships in 2 days", rooms: ["Bedroom", "Study"], collections: ["under-5k", "gifting"], motif: "sun" },
  { handle: "temple-lotus-pattachitra", title: "Temple Lotus", artistSlug: "ravi-chitrakar", artform: "Pattachitra", state: "Odisha", medium: "Natural colours on cloth", width: 14, height: 14, price: 2800, fulfilment: "ready-to-ship", makingDays: "Ships in 2 days", rooms: ["Pooja Room", "Study"], collections: ["under-5k", "gifting"], motif: "lotus" },
  { handle: "forest-geometry-gond", title: "Forest Geometry", artistSlug: "sunita-bhil", artform: "Gond", state: "Madhya Pradesh", medium: "Acrylic on canvas", width: 24, height: 24, price: 15200, compareAt: 17000, fulfilment: "made-to-order", makingDays: "3–4 weeks", rooms: ["Living Room", "Office"], collections: ["bestsellers"], motif: "geometric" },
  { handle: "fisherfolk-warli", title: "Fisherfolk", artistSlug: "arjun-warli", artform: "Warli", state: "Maharashtra", medium: "Rice paste on canvas", width: 16, height: 16, price: 3600, fulfilment: "ready-to-ship", makingDays: "Ships in 3 days", rooms: ["Dining Room", "Bedroom"], collections: ["under-5k", "nature"], motif: "fish", soldOut: true },
  { handle: "garuda-pattachitra", title: "Garuda Ascending", artistSlug: "ravi-chitrakar", artform: "Pattachitra", state: "Odisha", medium: "Natural colours on cloth", width: 24, height: 36, price: 34000, fulfilment: "made-to-order", makingDays: "6 weeks", rooms: ["Living Room"], collections: ["statement", "heritage"], motif: "peacock" },
  { handle: "lotus-offering-madhubani", title: "Lotus Offering", artistSlug: "meera-devi", artform: "Madhubani", state: "Bihar", medium: "Natural pigments on paper", width: 10, height: 10, price: 1800, fulfilment: "ready-to-ship", makingDays: "Ships in 2 days", rooms: ["Study", "Pooja Room"], collections: ["under-5k", "gifting"], motif: "lotus" },
];

export const artworks: Artwork[] = seeds.map((s, i) => ({
  ...s,
  palette: palettes[i % palettes.length],
  description: `${s.title} is a ${s.artform} work from ${s.state}, painted by hand using ${s.medium.toLowerCase()}. Each piece is signed by the artist and ships with a certificate of authenticity. Colours may vary slightly from the screen because pigments are handmade.`,
}));

export const getArtist = (slug: string) => artists.find((a) => a.slug === slug)!;
export const getArtwork = (handle: string) => artworks.find((a) => a.handle === handle);

export const artforms = [
  { name: "Madhubani", state: "Bihar", blurb: "Intricate line work and bold natural colour." },
  { name: "Pattachitra", state: "Odisha", blurb: "Temple stories painted on treated cloth." },
  { name: "Gond", state: "Madhya Pradesh", blurb: "Dotted forest spirits and animals." },
  { name: "Warli", state: "Maharashtra", blurb: "Rhythmic white figures on earthen walls." },
  { name: "Kerala Mural", state: "Kerala", blurb: "Five-colour temple murals of deities." },
  { name: "Miniature", state: "Rajasthan", blurb: "Court scenes in stone pigment and gold." },
  { name: "Phad", state: "Rajasthan", blurb: "Epic scrolls told through panels." },
  { name: "Thangka", state: "Ladakh", blurb: "Sacred mineral-pigment cotton paintings." },
];

export const collections = [
  { slug: "bestsellers", title: "Bestsellers", blurb: "Most loved by collectors this season", palette: ["#44153F", "#F0C330", "#F0E6D8"] as Artwork["palette"] },
  { slug: "heritage", title: "Heritage Classics", blurb: "Centuries-old traditions, faithfully kept", palette: ["#6A040F", "#FAA307", "#FFF3E0"] as Artwork["palette"] },
  { slug: "statement", title: "Statement Pieces", blurb: "Large works that anchor a room", palette: ["#1F3A3D", "#E07A5F", "#F4F1DE"] as Artwork["palette"] },
  { slug: "gifting", title: "Thoughtful Gifting", blurb: "Small works with big meaning", palette: ["#744379", "#F2CC8F", "#FDF6EC"] as Artwork["palette"] },
  { slug: "nature", title: "Nature & Wildlife", blurb: "Trees, birds, fish and flowers", palette: ["#3D405B", "#81B29A", "#F4F1DE"] as Artwork["palette"] },
  { slug: "under-5k", title: "Under ₹5,000", blurb: "Begin your collection", palette: ["#2B2D42", "#EF8354", "#EDF2F4"] as Artwork["palette"] },
];

export const rooms = ["Living Room", "Bedroom", "Dining Room", "Study", "Pooja Room", "Office"];

export const priceBands = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹25,000", min: 10000, max: 25000 },
  { label: "Above ₹25,000", min: 25000, max: Infinity },
];

export const testimonials = [
  { name: "Ananya R.", city: "Bengaluru", text: "The Gond painting arrived beautifully packed, with a handwritten note from the artist. It is the centrepiece of our living room." },
  { name: "Daniel K.", city: "Singapore", text: "Shipping and customs were handled end to end. The colours match the photos and the certificate made it feel truly special." },
  { name: "Priya M.", city: "Mumbai", text: "The art advisor suggested a size for my wall and it was perfect. Easily the most helpful buying experience I have had." },
];

export const announcements = [
  "Free shipping across India above ₹1,999",
  "International delivery to 40+ countries, customs handled",
  "Ready-to-ship artworks dispatched within 3 days",
];
