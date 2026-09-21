const Slider = () => {
const items = [
  "Where Quality Meets Innovation",    // bridges both worlds
  "Pure & Powerful",                   // organic + tools
  "Trusted for Every Need",            // universal appeal
  "Crafted with Care & Precision",     // food care + tool precision
  "Bringing the Best of Both Worlds",  // clearly communicates diversity
  "Quality You Can Feel",              // emotional + tangible
  "Innovating for a Better Life",      // forward-thinking
  "From Farm to Workshop",             // creative brand story
];

  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden bg-[#fdfcf0] py-2 sm:py-3 md:py-4 border-y border-stone-200">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {duplicatedItems.map((text, i) => (
          <div
            key={`${text}-${i}`}
            className="flex shrink-0 items-center gap-3 px-6 sm:gap-4 sm:px-8 md:px-10"
          >
            <span className="text-base text-[#dcd862] sm:text-lg">*</span>
            <span className="whitespace-nowrap text-sm italic text-[#6b7c3c] sm:text-base md:text-lg font-serif">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
