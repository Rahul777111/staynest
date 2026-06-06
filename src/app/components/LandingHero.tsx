"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MagnifyingGlass, ArrowDown } from "@phosphor-icons/react";

export default function LandingHero({
  onSearch,
}: {
  onSearch?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={ref}
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden"
    >
      {/* media layer */}
      <motion.div
        style={reduce ? undefined : { y, scale }}
        className="absolute inset-0"
      >
        {reduce ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/landing/hero.jpg"
            alt="Coastal villa at golden hour"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/landing/hero.jpg"
            className="h-full w-full object-cover"
          >
            <source src="/landing/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/65" />
      </motion.div>

      {/* content */}
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-center px-5"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
        >
          16 stays · 8 categories · worldwide
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Stay somewhere
          <br />
          worth the journey.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease }}
          className="mt-4 max-w-xl text-lg text-white/85"
        >
          Cliffside villas, snow cabins, overwater bungalows and more. Book in
          seconds, with reviews you can trust.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={onSearch}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#222] shadow-lg transition hover:bg-white/90 active:scale-[0.98]"
          >
            <MagnifyingGlass size={18} weight="bold" /> Start exploring
          </button>
          <span className="rounded-full border border-white/40 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm">
            4.9 average across 1,200+ reviews
          </span>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={22} />
      </motion.div>
    </section>
  );
}
