export type HelpfulResource = {
  title: string;
  description?: string;
  phone?: string;
  url?: string;
};

export const HELPFUL_RESOURCES: HelpfulResource[] = [
  {
    title: "Club welfare officer",
    description: "Contact your club’s designated welfare lead for advice and next steps.",
  },
  {
    title: "British Rowing safeguarding",
    description: "National governing body safeguarding information.",
    url: "https://www.britishrowing.org/safeguarding-protecting/",
  },
  {
    title: "NSPCC",
    phone: "0808 800 5000",
    description: "Advice and support on child protection concerns.",
  },
  {
    title: "Childline",
    phone: "0800 1111",
    description: "Free, confidential support for children and young people.",
  },
];
