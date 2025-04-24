"use client"
import { motion } from "framer-motion"
import type React from "react"

import { Code, Database, FileJson, Globe, Server, Workflow } from "lucide-react"

export function WebScraperAnimation() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* Background grid */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "30px 30px"],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Central globe */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-500/30 blur-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gray-900/80 border border-purple-500/30 backdrop-blur-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Globe className="w-12 h-12 text-purple-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Orbiting elements */}
      <OrbitingElement
        icon={<Server className="w-6 h-6 text-cyan-400" />}
        delay={0}
        distance={140}
        duration={15}
        size={40}
      />
      <OrbitingElement
        icon={<Database className="w-6 h-6 text-purple-400" />}
        delay={3}
        distance={140}
        duration={15}
        size={40}
        initialAngle={120}
      />
      <OrbitingElement
        icon={<FileJson className="w-6 h-6 text-cyan-400" />}
        delay={6}
        distance={140}
        duration={15}
        size={40}
        initialAngle={240}
      />

      {/* Data streams */}
      <DataStream start={{ x: -20, y: 50 }} end={{ x: 45, y: 45 }} color="purple" delay={0} />
      <DataStream start={{ x: 120, y: 50 }} end={{ x: 55, y: 45 }} color="cyan" delay={1} />
      <DataStream start={{ x: 50, y: -20 }} end={{ x: 50, y: 40 }} color="purple" delay={2} />
      <DataStream start={{ x: 50, y: 120 }} end={{ x: 50, y: 60 }} color="cyan" delay={3} />

      {/* Floating elements */}
      <FloatingElement icon={<Code className="w-5 h-5 text-purple-400" />} position={{ x: 20, y: 30 }} size={36} />
      <FloatingElement icon={<Workflow className="w-5 h-5 text-cyan-400" />} position={{ x: 80, y: 30 }} size={36} />
      <FloatingElement icon={<Database className="w-5 h-5 text-purple-400" />} position={{ x: 20, y: 70 }} size={36} />
      <FloatingElement icon={<FileJson className="w-5 h-5 text-cyan-400" />} position={{ x: 80, y: 70 }} size={36} />
    </div>
  )
}

interface OrbitingElementProps {
  icon: React.ReactNode
  distance: number
  duration: number
  size: number
  delay?: number
  initialAngle?: number
}

function OrbitingElement({ icon, distance, duration, size, delay = 0, initialAngle = 0 }: OrbitingElementProps) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      initial={{
        x: Math.cos((initialAngle * Math.PI) / 180) * distance,
        y: Math.sin((initialAngle * Math.PI) / 180) * distance,
      }}
      animate={{
        x: [
          Math.cos(((initialAngle + 0) * Math.PI) / 180) * distance,
          Math.cos(((initialAngle + 90) * Math.PI) / 180) * distance,
          Math.cos(((initialAngle + 180) * Math.PI) / 180) * distance,
          Math.cos(((initialAngle + 270) * Math.PI) / 180) * distance,
          Math.cos(((initialAngle + 360) * Math.PI) / 180) * distance,
        ],
        y: [
          Math.sin(((initialAngle + 0) * Math.PI) / 180) * distance,
          Math.sin(((initialAngle + 90) * Math.PI) / 180) * distance,
          Math.sin(((initialAngle + 180) * Math.PI) / 180) * distance,
          Math.sin(((initialAngle + 270) * Math.PI) / 180) * distance,
          Math.sin(((initialAngle + 360) * Math.PI) / 180) * distance,
        ],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
        delay,
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-gray-900/80 border border-gray-700 backdrop-blur-sm"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {icon}
      </motion.div>
    </motion.div>
  )
}

interface DataStreamProps {
  start: { x: number; y: number }
  end: { x: number; y: number }
  color: "purple" | "cyan"
  delay?: number
}

function DataStream({ start, end, color, delay = 0 }: DataStreamProps) {
  const colorClass = color === "purple" ? "bg-purple-500" : "bg-cyan-500"

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-500/50 to-transparent"
      style={{
        height: `${Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2))}%`,
        transform: `translate(-50%, -50%) translate(${start.x}%, ${start.y}%) rotate(${
          Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)
        }deg)`,
        transformOrigin: "0 0",
      }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full ${colorClass}`}
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: "100%", opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: delay + i * 0.4,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

interface FloatingElementProps {
  icon: React.ReactNode
  position: { x: number; y: number }
  size: number
}

function FloatingElement({ icon, position, size }: FloatingElementProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{ y: ["-5px", "5px", "-5px"] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <motion.div
        className="flex items-center justify-center rounded-lg bg-gray-900/80 border border-gray-700 backdrop-blur-sm"
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {icon}
      </motion.div>
    </motion.div>
  )
}
