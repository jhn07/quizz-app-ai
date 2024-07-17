"use client";

import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";


const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
};


export default function AiButton({ children }: { children: React.ReactNode }) {

  const [particleState, setParticlesReady] = useState<"loaded" | "ready">()
  const [isHovering, setIsHovering] = useState<boolean>()

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine)
    }).then(() => setParticlesReady("loaded"))
  }, [])


  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering

    return options
  }, [isHovering])

  return (
    <motion.button
      className="group relative my-8 rounded-full bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30 p-1 text-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 px-4 py-2 text-white group/star">
        <motion.div
          className="size-6 -translate-y-0.5"
          animate={{ opacity: [0.75, 1, 0.75], scale: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Sparkle className="feel-white group-hover/star:text-yellow-100" />
        </motion.div>
        <motion.div
          style={{ animationDelay: "1.5s", animationDuration: "2.5s" }}
          className="absolute left-2 top-5 -rotate-12"
          animate={{ opacity: [0.75, 1, 0.75], scale: [0.9, 1, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Sparkle className="fill-white h-4 w-4 group-hover/star:fill-yellow-200 group-hover/star:text-yellow-50" />
        </motion.div>
        <motion.div
          style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          className="absolute left-2 top-2"
          animate={{ opacity: [0.75, 1, 0.75], scale: [0.9, 1, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkle className="fill-white h-3 w-3 group-hover/star:fill-yellow-200 group-hover/star:text-yellow-50" />
        </motion.div>
        <span className="font-semibold">{children}</span>
      </div>
      {!!particleState && (
        <Particles
          id="whatever"
          className={`pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
          particlesLoaded={async () => setParticlesReady("ready")}
          options={modifiedOptions}
        />
      )}
    </motion.button>
  )
}