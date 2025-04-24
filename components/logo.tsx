"use client"
import { motion } from "framer-motion"
import { Database } from "lucide-react"

export function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative flex items-center justify-center w-10 h-10"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 opacity-80 blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 border border-gray-800">
          <Database className="w-5 h-5 text-purple-400" />
        </div>
      </motion.div>
      <div className="flex flex-col">
        <motion.h1
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Joco
        </motion.h1>
        <motion.span
          className="text-xs text-gray-400 -mt-1"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          Data Scraper
        </motion.span>
      </div>
    </motion.div>
  )
}
