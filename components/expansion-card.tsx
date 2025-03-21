"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"

interface ExpansionCardProps {
  name: string
  image: string
}

export function ExpansionCard({ name, image }: ExpansionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        className="overflow-hidden cursor-pointer h-full border border-border/40 shadow-md transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-4 pb-2">
          <h3 className="text-lg font-medium text-center">{name}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="relative w-full aspect-square rounded-md overflow-hidden border border-border/50">
            <div
              className={`absolute inset-0 bg-gradient-to-t from-primary/70 via-secondary/30 to-transparent z-10 transition-opacity duration-300 ${
                isHovered ? "opacity-80" : "opacity-60"
              }`}
            />
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className={`object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

