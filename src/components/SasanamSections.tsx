import React from "react";

interface SasanamSectionData {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SasanamSectionsProps {
  data: SasanamSectionData[];
  onChangeSection?: (sectionId: string) => void;
}

const sectionColors = [
  { bg: "from-[#8B4513]/10 to-[#8B4513]/5", icon: "text-[#8B4513]", border: "border-[#8B4513]/20 hover:border-[#8B4513]/40" },
  { bg: "from-[#6B3410]/10 to-[#6B3410]/5", icon: "text-[#6B3410]", border: "border-[#6B3410]/20 hover:border-[#6B3410]/40" },
  { bg: "from-[#a0522d]/10 to-[#a0522d]/5", icon: "text-[#a0522d]", border: "border-[#a0522d]/20 hover:border-[#a0522d]/40" },
  { bg: "from-[#7c5c3e]/10 to-[#7c5c3e]/5", icon: "text-[#7c5c3e]", border: "border-[#7c5c3e]/20 hover:border-[#7c5c3e]/40" },
];

const SasanamSections: React.FC<SasanamSectionsProps> = ({ data, onChangeSection }) => {
  return (
    <div className="w-full font-serif">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2516] tracking-tight">
          Archaeological Sections
        </h2>
        <p className="text-sm text-[#8C7055] mt-2">
          Explore {data.length} curated section{data.length !== 1 ? "s" : ""} of ancient inscriptions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((section, i) => {
          const color = sectionColors[i % sectionColors.length];
          return (
            <button
              key={section._id}
              type="button"
              onClick={() => onChangeSection?.(section._id)}
              className={`group relative text-left overflow-hidden bg-gradient-to-br ${color.bg} border ${color.border} rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(61,37,22,0.12)] active:scale-[0.98] min-h-[160px]`}
            >
              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] pointer-events-none">
                <svg viewBox="0 0 100 100" fill="currentColor" className={color.icon}>
                  <circle cx="80" cy="20" r="60" />
                </svg>
              </div>

              {/* Icon */}
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm mb-5 shadow-sm border border-white/40 ${color.icon}`}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#3D2516] group-hover:text-[#8B4513] transition-colors duration-200 mb-1">
                {section.name}
              </h3>

              {/* Footer */}
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8C7055]/70">Browse topics</span>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 group-hover:bg-[#8B4513] transition-all duration-300">
                  <svg className="w-4 h-4 text-[#8B4513] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SasanamSections;
