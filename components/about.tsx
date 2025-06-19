"use client"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-white islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h6 className="text-primary-600 font-medium mb-1 sm:mb-2 uppercase tracking-wider text-xs sm:text-sm">
            About Us
          </h6>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Excellence in Islamic Education
          </h2>
          <div className="islamic-divider w-16 sm:w-20 md:w-24 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-4">
            Founded in 1995, Madarsa Hajira has been a beacon of Islamic education and spiritual guidance for over 25
            years.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image src="/images/prayar.png" alt="Madarsa Hajira Building" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-xl max-w-[150px] sm:max-w-[200px] md:max-w-xs">
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3 mb-0.5 sm:mb-1 md:mb-2">
                <div className="bg-primary-100 p-1 sm:p-2 rounded-full">
                  <span className="font-noto text-base sm:text-lg md:text-xl font-bold text-primary-700">٢٥+</span>
                </div>
                <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Years of Excellence</h4>
              </div>
              <p className="text-gray-600 text-[10px] xs:text-xs md:text-sm">
                Providing quality Islamic education since 1995
              </p>
            </div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
            <motion.h3
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl font-bold text-primary-800 mb-3 sm:mb-4"
            >
              Our History & Mission
            </motion.h3>

            <motion.div variants={itemVariants} className="mb-3 sm:mb-4 md:mb-6">
              <p className="font-noto text-lg sm:text-xl text-primary-700 mb-1 sm:mb-2 urdu">
                ہمارا مقصد طلباء کو اسلامی تعلیمات سے آراستہ کرنا ہے
              </p>
              <p className="text-gray-600 text-xs sm:text-sm italic">
                "Our purpose is to equip students with Islamic teachings and values"
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 mb-3 sm:mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-base"
            >
              Madarsa Hajira was established with the vision of providing comprehensive Islamic education that balances
              traditional teachings with contemporary educational approaches. Our institution has grown from a small
              classroom to a full-fledged educational center serving hundreds of students.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 mb-4 sm:mb-6 md:mb-8 leading-relaxed text-xs sm:text-sm md:text-base"
            >
              Our mission is to nurture students who excel not only in Islamic knowledge but also in character and
              conduct. We strive to develop individuals who embody Islamic values and contribute positively to society.
            </motion.p>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-primary-50 p-4 md:p-6 rounded-lg border-l-4 border-primary-600">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Our Vision</h4>
                <p className="font-noto text-primary-700 mb-1 urdu text-base">علم کے ساتھ عمل</p>
                <p className="text-gray-700 text-sm md:text-base">
                  To be a leading institution that produces scholars who combine deep Islamic knowledge with exemplary
                  character.
                </p>
              </div>
              <div className="bg-primary-50 p-4 md:p-6 rounded-lg border-l-4 border-primary-600">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Our Values</h4>
                <p className="font-noto text-primary-700 mb-1 urdu text-base">اخلاق و کردار</p>
                <p className="text-gray-700 text-sm md:text-base">
                  Excellence, integrity, compassion, and dedication to lifelong learning and spiritual growth.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3">What Sets Us Apart</h4>
              <ul className="space-y-2">
                {[
                  "Qualified and experienced faculty",
                  "Comprehensive Islamic curriculum",
                  "Modern teaching methodologies",
                  "Focus on character development",
                  "Supportive learning environment",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
