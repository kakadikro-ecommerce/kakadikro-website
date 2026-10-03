import Image from "next/image";
import Link from "next/link";

const lines = [
  {
    name: "Cross Life",
    tag: "Foods & Spices",
    image: "/assets/crosslife.png",
    imageAlt: "Cross Life agri foods and spices",
    summary:
      "Cross Life is our kitchen line. It covers agri foods and spices you cook with every day, from masalas and whole spices to daily cooking staples.",
    includes: ["Agri foods", "Spices", "Masalas", "Whole spices"],
    href: "/products?type=CROSSLIFE",
    cta: "Shop Cross Life",
  },
  {
    name: "Cross Line",
    tag: "Agri Equipment",
    image: "/assets/crossline.png",
    imageAlt: "Cross Line agri equipment",
    summary:
      "Cross Line is our equipment line. It covers practical tools for farm and home work, including torches, water pumps, and other agri equipment.",
    includes: ["Torches", "Water pumps", "Agri equipment"],
    href: "/products?type=CROSSLINE",
    cta: "Shop Cross Line",
  },
];

export default function ProductLines() {
  return (
    <section className="w-full bg-[#fdfcf0] py-12 md:py-16">
      <div className="mx-auto max-w-7xl space-y-10 px-4 md:space-y-14 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            Our Lines
          </span>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-4xl">
            Two lines, one shop
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
            Kaka Dikro brings foods and farm equipment together. Cross Life is
            for the kitchen. Cross Line is for work around the farm and home.
          </p>
        </div>

        <div className="space-y-10 md:space-y-14">
          {lines.map((line, index) => {
            const imageFirst = index % 2 === 1;

            return (
              <article
                key={line.name}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
              >
                <div
                  className={`relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg ${
                    imageFirst ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <Image
                    src={line.image}
                    alt={line.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className={imageFirst ? "md:order-2" : "md:order-1"}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f7a34]">
                    {line.tag}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-[#003d4d] md:text-3xl">
                    {line.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                    {line.summary}
                  </p>

                  <p className="mt-5 text-sm font-semibold text-gray-900">
                    Includes
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {line.includes.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-[#d7e3c8] bg-white px-3 py-1 text-sm text-[#003d4d]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={line.href}
                    className="mt-6 inline-flex rounded-xl bg-[#7A330F] px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-[#5f2609] md:text-base"
                  >
                    {line.cta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
