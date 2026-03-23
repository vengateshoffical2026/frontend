import { useState, useEffect } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { toast } from "react-toastify";

// News & Events data — replace/extend this array with your actual JSON data
const newsEventsData = [
  {
    id: 1,
    title: "Discovery of Rare Pallava Inscription in Kanchipuram",
    description:
      "A team of researchers has uncovered a previously unknown Pallava-era stone inscription near the Kailasanatha Temple complex, dating back to the 7th century CE. The inscription details a land grant by King Narasimhavarman I.",
    date: "2026-03-20",
    type: "news" as const,
    isNew: true,
    image: "/acientBooks.png",
  },
  {
    id: 2,
    title: "Annual Heritage Symposium — Tamil Epigraphy 2026",
    description:
      "Join us on April 15th for our flagship conference bringing together scholars, epigraphists, and history enthusiasts from across the world. Topics include Chola copper plates, Grantha script evolution, and AI-assisted decipherment.",
    date: "2026-04-15",
    type: "event" as const,
    isNew: true,
    image: "/acientBooks.png",
  },
  {
    id: 3,
    title: "Sasanam Archive Crosses 10,000 Digitized Inscriptions",
    description:
      "We're thrilled to announce that our community-driven digitization project has surpassed the 10,000 inscription milestone. Thank you to every contributor who made this possible.",
    date: "2026-03-10",
    type: "news" as const,
    isNew: false,
  },
  {
    id: 4,
    title: "Workshop: Introduction to Reading Vatteluttu Script",
    description:
      "A beginner-friendly virtual workshop covering the basics of Vatteluttu, the ancient Tamil script. Includes hands-on exercises with real inscription rubbings. Limited seats available.",
    date: "2026-05-02",
    type: "event" as const,
    isNew: true,
  },
  {
    id: 5,
    title: "New Translation: Karandai Tamil Sangam Plates of Rajendrachola",
    description:
      "Our team has completed a comprehensive English translation of the famous Karandai Tamil Sangam plates. The full annotated text is now available in our Library section.",
    date: "2026-02-28",
    type: "news" as const,
    isNew: false,
  },
  {
    id: 6,
    title: "Community Field Trip — Mamallapuram Shore Temple Inscriptions",
    description:
      "Explore the inscriptions of the Shore Temple complex in Mamallapuram with expert guides. Open to all Sasanam community members. Registration closes April 1st.",
    date: "2026-04-20",
    type: "event" as const,
    isNew: false,
    image: "/acientBooks.png",
  },
];

type FilterType = "all" | "news" | "event";

const NewsEvents = () => {
  const headerReveal = useScrollReveal();
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const newItemsCount = newsEventsData.filter(item => item.isNew).length;
    if (newItemsCount > 0) {
      toast.info(`🎉 ${newItemsCount} new items have been added to our archive!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, []);

  const filteredItems =
    filter === "all"
      ? newsEventsData
      : newsEventsData.filter((item) => item.type === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = (dateStr: string) => new Date(dateStr) > new Date();

  return (
    <div className="min-h-screen px-5 sm:px-6 lg:px-8 py-16 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div
        ref={headerReveal.ref as any}
        className={`text-center mb-16 transition-all duration-1000 ease-out ${
          headerReveal.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-black text-[#4A3B32] tracking-tight">
          News & <span className="text-[#8B4513]">Events</span>
        </h1>
        <div className="w-24 h-1 bg-[#8B4513]/20 rounded-full mx-auto mt-6 mb-6" />
        <p className="text-lg text-[#6A5A4A] max-w-2xl mx-auto font-medium leading-relaxed">
          Stay updated with the latest discoveries, research milestones, and
          upcoming events from the Sasanam community.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {(["all", "news", "event"] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              filter === type
                ? "bg-[#8B4513] text-white shadow-xl -translate-y-0.5"
                : "bg-white/50 text-[#a78e7e] hover:bg-white/80 hover:text-[#8B4513] border border-[#8B4513]/10"
            }`}
          >
            {type === "all" ? "All" : type === "news" ? "News" : "Events"}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <NewsEventCard
            key={item.id}
            item={item}
            formatDate={formatDate}
            isUpcoming={isUpcoming}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-[#a78e7e] font-bold">
            No items found for this filter.
          </p>
        </div>
      )}
    </div>
  );
};

interface NewsEventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "news" | "event";
  isNew: boolean;
  image?: string;
}

const NewsEventCard = ({
  item,
  formatDate,
  isUpcoming,
}: {
  item: NewsEventItem;
  formatDate: (d: string) => string;
  isUpcoming: (d: string) => boolean;
}) => {
  const reveal = useScrollReveal();

  return (
    <article
      ref={reveal.ref as any}
      className={`group relative overflow-hidden rounded-3xl bg-[#F5F5DC]/80 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(61,37,22,0.1)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(61,37,22,0.18)] hover:border-white/50 ${
        reveal.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
    >
      {/* Badges */}
      <div className="absolute top-5 right-5 z-10 flex gap-2">
        {item.isNew && (
          <span className="px-3 py-1.5 rounded-full bg-[#8B4513] text-white text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
            New
          </span>
        )}
        {item.type === "event" && isUpcoming(item.date) && (
          <span className="px-3 py-1.5 rounded-full bg-white text-[#8B4513] text-[10px] font-black uppercase tracking-widest shadow-md ring-1 ring-[#8B4513]/20">
            Upcoming
          </span>
        )}
      </div>

      {/* Image */}
      {item.image && (
        <div className="h-48 overflow-hidden relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5DC]/90 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className={`p-8 ${item.image ? "-mt-8 relative z-[1]" : ""}`}>
        {/* Type & Date */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              item.type === "news"
                ? "bg-[#8B4513]/10 text-[#8B4513]"
                : "bg-[#4A3B32]/10 text-[#4A3B32]"
            }`}
          >
            {item.type === "news" ? "📰 News" : "📅 Event"}
          </span>
          <span className="text-xs font-bold text-[#a78e7e]">
            {formatDate(item.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#4A3B32] leading-snug mb-3 group-hover:text-[#8B4513] transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#6A5A4A] leading-relaxed line-clamp-3 font-medium">
          {item.description}
        </p>

        {/* Read More */}
        <div className="mt-6 flex items-center gap-2 text-[#8B4513] font-bold text-sm group-hover:gap-3 transition-all">
          <span>Read More</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default NewsEvents;
