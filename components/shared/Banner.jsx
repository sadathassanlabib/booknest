"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const slides = siteConfig.banners;
  const slide = slides[current];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="px-4 py-7 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[520px] max-w-[1180px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#17382c] via-[#214b3a] to-[#2e6a50]">
        
        {/* Decorative */}
        <div className="absolute -right-24 -top-28 h-[390px] w-[390px] rounded-full border-[45px] border-white/5" />

        <div className="absolute -bottom-32 right-20 h-[260px] w-[260px] rounded-full border-[32px] border-white/[0.035]" />

        <div className="relative z-10 flex min-h-[520px] items-center px-7 py-14 sm:px-12 lg:px-14">
          <div className="max-w-[700px] text-white">

            <div className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#a8cfb9]">
              {slide.eyebrow}
            </div>

            <h1 className="mt-4 text-[40px] font-black leading-[.98] tracking-[-.06em] sm:text-[52px] lg:text-[59px]">
              {slide.title}
            </h1>

            <p className="mt-5 max-w-[620px] text-sm leading-7 text-[#d6e3dc]">
              {slide.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href={slide.primaryHref}
                className="rounded-xl bg-[#3b775d] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-[#47866a]"
              >
                {slide.primaryText}
              </Link>

              <Link
                href={slide.secondaryHref}
                className="rounded-xl border border-white/15 bg-white/[0.07] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-white/[0.12]"
              >
                {slide.secondaryText}
              </Link>
            </div>
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-7 left-7 z-20 flex gap-1.5 sm:left-12">
          {slides.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;