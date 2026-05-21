const Slider = () => {
  const items = [
    "Purely Organic",
    "Crafted with Care",
    "Wholesome & Healthy",
    "Farm Fresh",
    "Certified Organic",
    "Carefully Crafted",
    "Healthy Choice",
    "Direct from Farm",
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
