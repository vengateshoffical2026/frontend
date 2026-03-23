export interface NewsEventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "news" | "event";
  isNew: boolean;
  image?: string;
}

export const newsEventsData: NewsEventItem[] = [
  {
    id: 1,
    title: "Discovery of Rare Pallava Inscription in Kanchipuram",
    description:
      "A team of researchers has uncovered a previously unknown Pallava-era stone inscription near the Kailasanatha Temple complex, dating back to the 7th century CE. The inscription details a land grant by King Narasimhavarman I.",
    date: "2026-03-20",
    type: "news",
    isNew: true,
    image: "/acientBooks.png",
  },
  {
    id: 2,
    title: "Annual Heritage Symposium — Tamil Epigraphy 2026",
    description:
      "Join us on April 15th for our flagship conference bringing together scholars, epigraphists, and history enthusiasts from across the world. Topics include Chola copper plates, Grantha script evolution, and AI-assisted decipherment.",
    date: "2026-04-15",
    type: "event",
    isNew: true,
    image: "/acientBooks.png",
  },
  {
    id: 3,
    title: "Sasanam Archive Crosses 10,000 Digitized Inscriptions",
    description:
      "We're thrilled to announce that our community-driven digitization project has surpassed the 10,000 inscription milestone. Thank you to every contributor who made this possible.",
    date: "2026-03-10",
    type: "news",
    isNew: false,
  },
  {
    id: 4,
    title: "Workshop: Introduction to Reading Vatteluttu Script",
    description:
      "A beginner-friendly virtual workshop covering the basics of Vatteluttu, the ancient Tamil script. Includes hands-on exercises with real inscription rubbings. Limited seats available.",
    date: "2026-05-02",
    type: "event",
    isNew: true,
  },
  {
    id: 5,
    title: "New Translation: Karandai Tamil Sangam Plates of Rajendrachola",
    description:
      "Our team has completed a comprehensive English translation of the famous Karandai Tamil Sangam plates. The full annotated text is now available in our Library section.",
    date: "2026-02-28",
    type: "news",
    isNew: false,
  },
  {
    id: 6,
    title: "Community Field Trip — Mamallapuram Shore Temple Inscriptions",
    description:
      "Explore the inscriptions of the Shore Temple complex in Mamallapuram with expert guides. Open to all Sasanam community members. Registration closes April 1st.",
    date: "2026-04-20",
    type: "event",
    isNew: false,
    image: "/acientBooks.png",
  },
];
