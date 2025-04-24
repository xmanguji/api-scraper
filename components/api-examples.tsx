"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiCategory {
  name: string
  apis: {
    name: string
    url: string
    icon: string
    description: string
  }[]
}

const apiCategories: ApiCategory[] = [
  {
    name: "User Data",
    apis: [
      {
        name: "Users",
        url: "https://jsonplaceholder.typicode.com/users",
        icon: "/api-icons/jsonplaceholder.png",
        description: "Sample user data with names, emails, and addresses",
      },
      {
        name: "Dummy Users",
        url: "https://dummyjson.com/users",
        icon: "/api-icons/dummyjson.png",
        description: "Fake user data with profile images and details",
      },
    ],
  },
  {
    name: "Content",
    apis: [
      {
        name: "Posts",
        url: "https://jsonplaceholder.typicode.com/posts",
        icon: "/api-icons/jsonplaceholder.png",
        description: "Sample blog posts with titles and content",
      },
      {
        name: "Comments",
        url: "https://jsonplaceholder.typicode.com/comments",
        icon: "/api-icons/jsonplaceholder.png",
        description: "Comments with email and message content",
      },
      {
        name: "Quotes",
        url: "https://dummyjson.com/quotes",
        icon: "/api-icons/dummyjson.png",
        description: "Inspirational quotes from various authors",
      },
    ],
  },
  {
    name: "Products",
    apis: [
      {
        name: "Products",
        url: "https://dummyjson.com/products",
        icon: "/api-icons/dummyjson.png",
        description: "Product listings with prices and descriptions",
      },
      {
        name: "Store Products",
        url: "https://fakestoreapi.com/products",
        icon: "/api-icons/fakestore.png",
        description: "E-commerce products with images and ratings",
      },
    ],
  },
  {
    name: "Geographic",
    apis: [
      {
        name: "Countries",
        url: "https://restcountries.com/v3.1/all",
        icon: "/api-icons/restcountries.png",
        description: "Detailed information about countries worldwide",
      },
    ],
  },
]

export function ApiExamples({ onSelectUrl }: { onSelectUrl: (url: string) => void }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="relative w-full mt-6 mb-2">
      <h3 className="text-sm font-medium text-purple-400 mb-3">Example APIs:</h3>

      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 hover:text-purple-400"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {apiCategories.map((category) => (
            <div key={category.name} className="flex-none">
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-800 p-3 w-[280px]">
                <h4 className="text-xs font-medium text-purple-400 mb-2">{category.name}:</h4>
                <div className="space-y-2">
                  {category.apis.map((api) => (
                    <motion.div
                      key={api.name}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800/50 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectUrl(api.url)}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden">
                        <img
                          src={api.icon || "/placeholder.svg"}
                          alt={api.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement
                            target.src = "/api-icons/default.png"
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-white truncate">{api.name}</h5>
                        <p className="text-xs text-gray-400 truncate">{api.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 hover:text-purple-400"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        )}
      </div>
    </div>
  )
}
