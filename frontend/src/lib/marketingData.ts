// Marketing Work — curated stock imagery + copy for the editorial ecosystem.
// Swap any URL here to change the section's photography. All Unsplash/Pexels.

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=srgb&fm=jpg&q=80&w=${w}`;

// Hospitality / F&B
const H_DINING = U("1729809106394-7ceb922b37f0");
const H_TABLE = U("1523699289804-55347c09047d");
const H_BREAKFAST = U("1596701062351-8c2c14d1fdd0");
const H_MUG = U("1621873495868-6c5774cf6012");
const H_CHANDELIER = "https://images.pexels.com/photos/33824477/pexels-photo-33824477.jpeg?auto=compress&cs=tinysrgb&w=900";
const H_ROOM = "https://images.pexels.com/photos/3884679/pexels-photo-3884679.jpeg?auto=compress&cs=tinysrgb&w=900";

// Travel / destinations
const T_VALLEY = U("1645873324895-09879e84bfd6");
const T_CANOES = U("1718383537411-6f9e727ae0bb");
const T_TOWN = U("1712510817140-917938f92e5b");
const T_GREEN = U("1624807136278-e2973be118ff");
const T_GHATS = "https://images.pexels.com/photos/17693658/pexels-photo-17693658.jpeg?auto=compress&cs=tinysrgb&w=900";
const T_VILLAGE = "https://images.pexels.com/photos/19041828/pexels-photo-19041828.jpeg?auto=compress&cs=tinysrgb&w=900";

// Creators
const C_DENIM = U("1546961329-78bef0414d7c", 500);
const C_URBAN = "https://images.pexels.com/photos/32631774/pexels-photo-32631774.jpeg?auto=compress&cs=tinysrgb&w=500";
const C_LAKE = U("1504343661714-6ab753336297", 500);

// Events
const E_FIELD = U("1533174072545-7a4b6ad7a6c3");

export interface Shot {
  src: string;
  n: string;
  cap: string;
  coord: string;
}

export const PHOTOSHOOT: Shot[] = [
  { src: H_TABLE, n: "01", cap: "À la carte", coord: "30.08°N 78.26°E" },
  { src: T_VALLEY, n: "02", cap: "River bend", coord: "30.12°N 78.32°E" },
  { src: H_BREAKFAST, n: "03", cap: "Room service", coord: "30.09°N 78.27°E" },
  { src: T_TOWN, n: "04", cap: "Temple town", coord: "30.11°N 78.30°E" },
  { src: H_CHANDELIER, n: "05", cap: "Evening bar", coord: "30.08°N 78.25°E" },
  { src: H_MUG, n: "06", cap: "Slow mornings", coord: "30.10°N 78.29°E" },
];

export const SOCIAL = [
  { src: T_CANOES, label: "REELS", cap: "River rafting" },
  { src: H_ROOM, label: "STORIES", cap: "Suite tour" },
  { src: T_GHATS, label: "POSTS", cap: "The ghats" },
];

export const INFLUENCERS = [
  { src: C_DENIM, handle: "@wandergram", reach: "84K" },
  { src: C_URBAN, handle: "@streetlens", reach: "51K" },
  { src: C_LAKE, handle: "@trailnotes", reach: "120K" },
];

export const IMAGES = {
  eventPhoto: E_FIELD,
  listingPhoto: H_DINING,
  websitePhoto: T_VALLEY,
  blogPhoto: T_TOWN,
  personalHero: T_GREEN,
  personalThumb: T_CANOES,
  loyalty: H_ROOM,
};
