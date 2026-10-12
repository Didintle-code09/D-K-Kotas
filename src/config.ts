// All DK Spot business content lives here. Components read from this file only.
// Anything in [BRACKETS] is a placeholder that still needs to be confirmed.

export type Category = "Kotas" | "Burgers" | "Chip rolls" | "Fries";
export type DayName = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface MenuItem {
  readonly id: string;
  readonly category: Category;
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly featured?: boolean;
  readonly badge?: string;
}

export interface DayHours {
  readonly day: DayName;
  readonly open: string | null;
  readonly close: string | null;
}

/** A heading with an italic serif lead, e.g. "*Most* loved". */
export interface LeadHeading {
  readonly lead: string;
  readonly rest: string;
}

export interface LegalSection {
  readonly title: string;
  readonly body: string;
  readonly link?: { readonly text: string; readonly href: string };
}

export interface LegalDoc {
  readonly pageTitle: string;
  readonly heading: string;
  readonly sections: readonly LegalSection[];
}

export interface SiteConfig {
  readonly businessName: string;
  readonly tagline: string;
  readonly subline: string;
  readonly address: string;
  readonly whatsappNumber: string;
  readonly whatsappDisplay: string;
  readonly timezone: string;
  readonly hours: readonly DayHours[];
  readonly uberEatsUrl: string;
  readonly mapsUrl: string;
  readonly instagramUrl: string;
  readonly tiktokUrl: string;
  readonly heroImage: string;
  readonly bannerImage: string;
  readonly ratingLabel: string;
  readonly creditName: string;
  readonly creditUrl: string;
  readonly legalLastUpdated: string;
  readonly menu: readonly MenuItem[];
}

// Shared values used inside the legal copy below.
const shortAddress = "13 Graduate St, Belhar 8, Cape Town";
const whatsappDisplay = "[0XX XXX XXXX]";

export const config = {
  businessName: "DK Spot",
  tagline: "Kota at its best. Monate!",
  subline: "Monate. Every single bite.",
  address: "13 Graduate St, Belhar 8, Cape Town, 7493",
  whatsappNumber: "[27XXXXXXXXX]", // digits only, no +
  whatsappDisplay,
  timezone: "Africa/Johannesburg",
  hours: [ // [CONFIRM] Google shows these; Uber Eats shows 11:15–20:00
    { day: "Mon", open: "12:00", close: "19:00" },
    { day: "Tue", open: "12:00", close: "19:00" },
    { day: "Wed", open: "12:00", close: "19:00" },
    { day: "Thu", open: "12:00", close: "19:00" },
    { day: "Fri", open: "12:00", close: "19:00" },
    { day: "Sat", open: "12:00", close: "20:00" },
    { day: "Sun", open: null, close: null },
  ],
  uberEatsUrl: "https://www.ubereats.com/za/store/dk-spot-&-kota-restaurant/zhlxodzxV3yR3IkbMHvUWA",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=DK+Spot+kota+at+its+best&query_place_id=ChIJzcVyF3JRzB0RTy-wWd3ikas",
  instagramUrl: "",
  tiktokUrl: "",
  heroImage: "/images/hero-placeholder.jpg",
  bannerImage: "/images/banner-placeholder.jpg",
  ratingLabel: "4.5 on Uber Eats · 700+ ratings",
  creditName: "Moratamotho Devs",
  creditUrl: "https://moratamothodevs.co.za",
  legalLastUpdated: "[DATE]",
  menu: [
    { id: "kota-1", category: "Kotas", name: "Kota 1", price: 35, description: "Chips, atchar, lettuce, polony" },
    { id: "kota-2", category: "Kotas", name: "Kota 2", price: 40, description: "Kota 1 + cheese" },
    { id: "kota-3", category: "Kotas", name: "Kota 3", price: 45, description: "Chips, atchar, lettuce, polony, cheese, Vienna", featured: true, badge: "Most loved" },
    { id: "kota-4", category: "Kotas", name: "Kota 4", price: 50, description: "Everything in Kota 3, plus egg", featured: true },
    { id: "kota-5", category: "Kotas", name: "Kota 5", price: 60, description: "[FILLINGS]", featured: true },
    { id: "kota-6", category: "Kotas", name: "Kota 6", price: 70, description: "[FILLINGS]" },
    { id: "kota-7", category: "Kotas", name: "Kota 7", price: 80, description: "[FILLINGS] · the full stack" },
    { id: "snack-burger", category: "Burgers", name: "Snack Burger", price: 30, description: "Patty, cheese, ketchup" },
    { id: "real-deal", category: "Burgers", name: "Real Deal Burger", price: 40, description: "2 patties, cheese, lettuce, tomato, onion" },
    { id: "jumbo", category: "Burgers", name: "Jumbo Burger", price: 60, description: "3 patties, 3 cheeses, lettuce, tomato, onion" },
    { id: "chip-roll", category: "Chip rolls", name: "Chip Roll", price: 30, description: "" },
    { id: "vienna-chip-roll", category: "Chip rolls", name: "Vienna Chip Roll", price: 35, description: "" },
    { id: "russian-chip-roll", category: "Chip rolls", name: "Russian Chip Roll", price: 45, description: "" },
    { id: "fries-regular", category: "Fries", name: "Fries (regular)", price: 45, description: "" },
  ],
} as const satisfies SiteConfig;

// Widened views of the config for components (the `as const` literal types are too narrow to iterate over).
export const menu: readonly MenuItem[] = config.menu;
export const hours: readonly DayHours[] = config.hours;

/** Site copy: every visible string the components render. */
export const copy = {
  wordmarkSub: "Kota House · Belhar",
  heroImageAlt: "Photo coming soon",
  bannerImageAlt: "Photo coming soon",
  skipLink: "Skip to content",
  addedAnnouncement: "added to your basket.",

  nav: {
    links: [
      { id: "menu", label: "Menu" },
      { id: "preorder", label: "Pre-order" },
      { id: "find-us", label: "Find us" },
    ],
    cta: "Pre-order Now",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  hero: {
    headline: { lead: "Kota at its", rest: " Best." },
    primary: "Pre-order Now",
    secondary: "See the Menu",
  },

  mostLoved: {
    heading: { lead: "Most", rest: " loved" },
    add: "Add",
  },

  menu: {
    heading: { lead: "The", rest: " menu" },
    categories: ["Kotas", "Burgers", "Chip rolls", "Fries"] as readonly Category[],
    categoryNotes: {
      Kotas: "Every Kota stacks on the one before it.",
    } as Partial<Record<Category, string>>,
    priceNote: "Prices may differ from Uber Eats. Confirm in store.",
    added: "Added",
    basketSummary: "In your basket:",
    goToPreorder: "Go to pre-order",
  },

  banner: {
    heading: { lead: "Order ahead.", rest: " Skip the wait." },
    subline: "Pick a time. It's ready when you walk in.",
    cta: "Pre-order Now",
  },

  preorder: {
    heading: { lead: "Pre-order", rest: " for pickup" },
    intro: "Send your order on WhatsApp and collect it at your time. Pay when you collect.",
    basketLabel: "Your basket",
    emptyBasket: "Your basket is empty — add something from the menu.",
    addMore: "+ Add more from the menu",
    nameLabel: "Your name",
    timeLabel: "Pickup time",
    asap: "ASAP",
    closedNote: "We're closed right now — pick a time for when we open",
    noSlots: "No pickup times are available right now.",
    noteLabel: "Anything else?",
    notePlaceholder: "e.g. no atchar on one",
    optional: "(optional)",
    totalLabel: "Total",
    payNote: "Pay when you collect",
    consentBefore: "I agree to the ",
    consentTerms: "Terms",
    consentMiddle: " and ",
    consentPrivacy: "Privacy Policy",
    consentAfter: ".",
    send: "Send order on WhatsApp",
    missingPrefix: "To send your order:",
    missing: {
      basket: "add an item",
      name: "enter your name",
      time: "pick a time",
      consent: "tick the box above",
    },
    sent: "Your order is ready — just hit send in WhatsApp. We'll confirm it there.",
    reopen: "WhatsApp didn't open? Try again",
    deliveryPrefix: "Prefer delivery? ",
    deliveryLink: "Order on Uber Eats",
    message: {
      greeting: "Hi DK Spot! Pre-order for pickup 🍞",
      name: "Name:",
      pickup: "Pickup:",
      divider: "——————",
      total: "Total:",
      totalSuffix: "(pay on collection)",
      note: "Note:",
      asapWhenOpen: "ASAP (when you open)",
    },
  },

  findUs: {
    heading: { lead: "Find", rest: " us" },
    addressLabel: "Address",
    hoursLabel: "Opening hours",
    openNow: "Open now",
    closed: "Closed",
    closedDay: "Closed",
    today: "Today",
    directions: "Get directions",
  },

  floatingWhatsApp: {
    message: "Hi DK Spot!",
    label: "Chat to DK Spot on WhatsApp",
  },

  footer: {
    whatsappLabel: "WhatsApp",
    hoursLabel: "Hours",
    instagram: "DK Spot on Instagram",
    tiktok: "DK Spot on TikTok",
    terms: "Terms",
    privacy: "Privacy",
    creditPrefix: "Website by ",
  },

  dayNames: {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  } as Record<DayName, string>,
  todayWord: "Today",
  tomorrowWord: "Tomorrow",
  newTab: "(opens in a new tab)",
  lastUpdated: "Last updated:",
  notFound: {
    title: "Page not found | DK Spot",
    heading: { lead: "Lost", rest: " the way?" },
    body: "That page doesn't exist.",
    back: "Back to home",
  },
} as const;

export const terms: LegalDoc = {
  pageTitle: "Terms and Conditions | DK Spot",
  heading: "DK Spot — Terms and Conditions",
  sections: [
    { title: "1. About us", body: `DK Spot is a takeaway at ${shortAddress}. Contact: WhatsApp ${whatsappDisplay}.` },
    { title: "2. Pre-orders", body: "Sending a pre-order on WhatsApp is a request. Your order is confirmed only when we reply to confirm it. During busy times we may suggest a later pickup time." },
    { title: "3. Prices and payment", body: "Prices on this website are for collection at our shop and may differ from delivery apps. You pay when you collect. Prices may change without notice; the price confirmed in WhatsApp applies." },
    { title: "4. Collection", body: "Please collect at your chosen time. Orders not collected within [30] minutes of the pickup time may be released." },
    { title: "5. Availability", body: "Items depend on stock. If something runs out, we will offer you a swap or remove it before you pay." },
    { title: "6. Allergies", body: "Our food may contain wheat, eggs, dairy, soy and other allergens, and is prepared in a shared kitchen. Tell us about allergies before you order." },
    { title: "7. Delivery", body: "Delivery orders are placed through Uber Eats and fall under Uber Eats' own terms." },
    { title: "8. Complaints", body: "If something is wrong with your order, tell us when you collect or message us the same day." },
    { title: "9. Governing law", body: "These terms are governed by the laws of the Republic of South Africa." },
    { title: "10. Changes", body: "We may update these terms. The version on this page applies when you order." },
  ],
};

export const privacy: LegalDoc = {
  pageTitle: "Privacy Policy | DK Spot",
  heading: "DK Spot — Privacy Policy",
  sections: [
    { title: "1. Who we are", body: `DK Spot, ${shortAddress}, is responsible for your personal information. Contact: WhatsApp ${whatsappDisplay}.` },
    { title: "2. What we collect", body: "When you pre-order: your name, your order, your pickup time and any note. WhatsApp also shows us your phone number." },
    { title: "3. How the pre-order form works", body: "The form does not store anything on this website. It opens WhatsApp with your order filled in, and nothing is sent until you press send. Once sent, your message is also handled under WhatsApp's own privacy policy." },
    { title: "4. Why we use it", body: "Only to confirm, prepare and hand over your order, and to contact you about that order. No marketing messages unless you ask for them." },
    { title: "5. Sharing", body: "We do not sell or share your information, except if the law requires it." },
    { title: "6. How long we keep it", body: "Only as long as needed for your order, usually no longer than [3 months]." },
    {
      title: "7. Your rights",
      body: "Under POPIA you may ask what we hold about you, ask us to correct or delete it, or object to its use. You may also complain to the Information Regulator of South Africa (inforegulator.org.za).",
      link: { text: "inforegulator.org.za", href: "https://inforegulator.org.za" },
    },
    { title: "8. Hosting and cookies", body: "This website is hosted by Netlify, which may log basic technical data to keep it secure. We use no tracking or advertising cookies." },
    { title: "9. Changes", body: "We may update this policy. The latest version is always on this page." },
  ],
};
