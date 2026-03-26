

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

const SasanamSections: React.FC<SasanamSectionsProps> = ({ data, onChangeSection }) => {


  return (
    <div className="w-full px-4 py-6 font-serif">
            <>
            <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2516] tracking-tight">
            Archaeological Sections
          </h2>
          <p className="text-sm text-[#8C7055] mt-0.5">
            {data.length} section{data.length !== 1 ? "s" : ""} in the archive
          </p>
        </div>
      </div>

      {/* ── Section Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data.map((section, i) => (
          <div
            key={section._id}
            className="relative group bg-[#fdf8f0] border border-[#e2c9a0] rounded-2xl shadow-[0_2px_16px_rgba(61,37,22,0.07)] p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#fffdf7] hover:shadow-[0_8px_28px_rgba(61,37,22,0.12)] hover:border-[#c9a87a]"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => onChangeSection?.(section._id)}
          >
            {/* Decorative corner accent */}
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#e2c9a0] group-hover:bg-[#c9a87a] transition-colors duration-300" />

            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#f0e6d3] mb-4 shadow-inner ring-1 ring-[#e2c9a0] group-hover:ring-[#c9a87a] transition-all duration-300 text-[#8C6A4A] group-hover:text-[#6b3f1a]">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-[#3D2516] mb-1 tracking-wide group-hover:text-[#6b3f1a] transition-colors duration-200 leading-snug">
              {section.name}
            </h3>
          </div>
        ))}
      </div>
            </>
      
    </div>
  );
};

export default SasanamSections;