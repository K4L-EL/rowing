export type KitItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  color: "white" | "bluePale" | "blueLight" | "mint" | "lavender" | "blush";
  badge?: string;
};

/** Mock Godfrey-style kit items. Green & pink colourway for an example club. */
export const KIT_ITEMS: KitItem[] = [
  {
    id: "custom-aio",
    name: "Custom AIO",
    price: 75,
    description: "All-in-one rowing suit in club colours with mesh back panel.",
    color: "mint",
    badge: "New",
  },
  {
    id: "custom-singlet",
    name: "Custom Singlet",
    price: 51,
    description: "Lightweight racing singlet with club stripe.",
    color: "blush",
  },
  {
    id: "classic-hoodie",
    name: "Classic Hoodie",
    price: 37,
    description: "Heavyweight cotton hoodie with embroidered club crest.",
    color: "white",
  },
  {
    id: "custom-shorts",
    name: "Custom Shorts",
    price: 55,
    description: "Compression shorts in club colourway.",
    color: "bluePale",
  },
  {
    id: "custom-trackies",
    name: "Custom Trackies",
    price: 57,
    description: "Warm-up trackpants with side stripes.",
    color: "lavender",
  },
  {
    id: "classic-cap",
    name: "Classic Cap",
    price: 15,
    description: "Six-panel cap with club logo.",
    color: "mint",
  },
  {
    id: "essentials-kitbag",
    name: "Essentials Kitbag",
    price: 34,
    description: "Waterproof holdall with drawstring liner.",
    color: "blueLight",
  },
  {
    id: "custom-splash",
    name: "Custom Splash Jacket",
    price: 102,
    description: "Wind and water resistant racing jacket.",
    color: "blush",
    badge: "Popular",
  },
];
