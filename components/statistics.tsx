"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, BookOpen, GraduationCap, Award } from "lucide-react"

const stats = [
  {
    id: 1,
    value: "500+",
    label: "Students Enrolled",
    icon: <Users className="h-8 w-8 text-primary-600" />,
  },
  {
    id: 2,
    value: "25+",
    label: "Years of Excellence",
    icon: <Award className="h-8 w-8 text-primary-600" />,
  },
  {
    id: 3,
    value: "20+",
    label: "Qualified Teachers",
    icon: <GraduationCap className="h-8 w-8 text-primary-600" />,
  },
  {
    id: 4,
    value: "5",
    label: "Specialized Programs",
    icon: <BookOpen className="h-8 w-8 text-primary-600" />,
  },
]

export default function Statistics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-16 bg-primary-900 text-white">
      <div ref={ref} className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="bg-primary-800/50 backdrop-blur-sm p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-primary-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2 text-white">{stat.value}</h3>
              <p className="text-primary-200">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
