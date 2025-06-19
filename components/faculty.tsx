"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Mail, Phone } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

const facultyMembers = [
  {
    id: 1,
    name: "Maulana Abdul Rahman",
    role: "Principal & Hifz Instructor",
    image: "/images/person1.png",
    bio: "Maulana Abdul Rahman has over 20 years of experience in teaching Hifz and Islamic studies. He is a Hafiz-e-Quran and holds a degree in Islamic Theology.",
    email: "abdul.rahman@madarsahajira.com",
    phone: "+1 (123) 456-7890",
  },
  {
    id: 2,
    name: "Qari Muhammad Ali",
    role: "Tajweed Specialist",
    image: "/images/person2.png",
    bio: "Qari Muhammad Ali is renowned for his expertise in Tajweed. He has trained numerous students who have gone on to become Qaris themselves.",
    email: "muhammad.ali@madarsahajira.com",
    phone: "+1 (123) 456-7891",
  },
  {
    id: 3,
    name: "Maulana Ibrahim Khan",
    role: "Arabic Language Instructor",
    image: "/images/person3.png",
    bio: "Maulana Ibrahim Khan specializes in Arabic language instruction. He holds a Master's degree in Arabic Literature and has authored several textbooks.",
    email: "ibrahim.khan@madarsahajira.com",
    phone: "+1 (123) 456-7892",
  },
  {
    id: 4,
    name: "Ahmed",
    role: "Islamic Studies Teacher",
    image: "/images/person4.png",
    bio: "Ahmed focuses on Islamic studies for female students. He has a background in comparative religion and Islamic jurisprudence.",
    email: "ahmed@madarsahajira.com",
    phone: "+1 (123) 456-7893",
  },
]

export default function Faculty() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const isMobile = useMediaQuery("(max-width: 639px)")

  return (
    <section id="faculty" ref={ref} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h6 className="text-primary-600 font-medium mb-2 uppercase tracking-wider text-xs sm:text-sm">Our Faculty</h6>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Meet Our Esteemed Teachers
          </h2>
          <div className="w-16 md:w-20 h-1 bg-primary-600 mx-auto mb-3 sm:mb-4 md:mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Our qualified and experienced faculty members are dedicated to providing the highest quality of Islamic
            education.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {facultyMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
                      aria-label={`Call ${member.name}`}
                    >
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">{member.role}</p>
                <p className="text-gray-600 text-xs sm:text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
