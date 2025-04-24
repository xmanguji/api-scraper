"use client"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20">
        <Grid />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        <Particles />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientOrbs />
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 bg-black opacity-60 pointer-events-none 
                    bg-gradient-radial from-transparent to-black"
      />
    </div>
  )
}

function Grid() {
  return (
    <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
  )
}

function Particles() {
  const count = 40
  const particles = Array.from({ length: count })

  return (
    <div className="relative h-full w-full">
      {particles.map((_, i) => {
        const size = Math.random() * 2 + 1
        const opacity = Math.random() * 0.5 + 0.1

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500"
            style={{
              width: size,
              height: size,
              opacity,
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        )
      })}
    </div>
  )
}

function GradientOrbs() {
  return (
    <>
      <motion.div
        className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-400/0 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/0 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-400/0 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </>
  )
}
