"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Book, BookOpen, Bookmark, FileText, Users, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

const programsData = [
  {
    id: 1,
    title: "Hifz-ul-Quran",
    urduTitle: "حفظ القرآن",
    description:
      "Complete memorization of the Holy Quran with proper tajweed and understanding of the text. Our experienced instructors guide students through a structured program that ensures proper memorization and retention.",
    urduDescription: "قرآن مجید کو صحیح تجوید کے ساتھ حفظ کرنا اور اس کے معانی کو سمجھنا",
    duration: "3-5 years",
    ageGroup: "8-15 years",
    schedule: "Daily, 5 days a week",
    icon: <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />,
    features: [
      "Personalized attention with small group sizes",
      "Regular revision sessions",
      "Tajweed rules application",
      "Memorization techniques",
      "Certification upon completion",
    ],
  },
  {
    id: 2,
    title: "Tajweed",
    urduTitle: "تجوید",
    description:
      "Learn the proper pronunciation and recitation rules of the Holy Quran. This program focuses on the correct articulation of Arabic letters, proper application of Tajweed rules, and beautiful recitation of the Quran.",
    urduDescription: "قرآن مجید کی صحیح تلاوت اور عربی حروف کی درست ادائیگی سیکھیں",
    duration: "1-2 years",
    ageGroup: "All ages",
    schedule: "3 days a week",
    icon: <Book className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />,
    features: [
      "Makharij (articulation points) training",
      "Rules of recitation",
      "Practical application",
      "Regular recitation practice",
      "Certification upon completion",
    ],
  },
  {
    id: 3,
    title: "Islamic Studies",
    urduTitle: "اسلامی تعلیمات",
    description:
      "Comprehensive study of Islamic principles, history, and practices. This program covers various aspects of Islam including Aqeedah (beliefs), Fiqh (jurisprudence), Seerah (Prophetic biography), and Islamic history.",
    urduDescription: "اسلامی اصولوں، تاریخ اور عملی زندگی کا جامع مطالعہ",
    duration: "Ongoing",
    ageGroup: "All ages",
    schedule: "Weekends",
    icon: <Bookmark className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />,
    features: [
      "Comprehensive curriculum",
      "Interactive learning methods",
      "Regular assessments",
      "Guest lectures by scholars",
      "Field trips to Islamic sites",
    ],
  },
  {
    id: 4,
    title: "Arabic Language",
    urduTitle: "عربی زبان",
    description:
      "Learn to read, write, and speak Arabic with focus on Quranic Arabic. This program is designed to help students understand the language of the Quran and develop communication skills in Modern Standard Arabic.",
    urduDescription: "عربی زبان پڑھنا، لکھنا اور بولنا سیکھیں، قرآنی عربی پر خصوصی توجہ",
    duration: "2-3 years",
    ageGroup: "10+ years",
    schedule: "Twice a week",
    icon: <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />,
    features: [
      "Grammar and vocabulary building",
      "Reading and writing practice",
      "Conversation skills",
      "Quranic Arabic focus",
      "Cultural context understanding",
    ],
  },
  {
    id: 5,
    title: "Fiqh (Islamic Jurisprudence)",
    urduTitle: "فقہ",
    description:
      "Study of Islamic law and the principles of Islamic jurisprudence. This advanced program explores the methodology of deriving Islamic rulings from primary sources and understanding the differences between various schools of thought.",
    urduDescription: "اسلامی قانون اور اصول فقہ کا مطالعہ، مختلف مکاتب فکر کا تقابلی جائزہ",
    duration: "2-4 years",
    ageGroup: "15+ years",
    schedule: "Twice a week",
    icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />,
    features: [
      "Usul al-Fiqh (principles of jurisprudence)",
      "Comparative study of madhabs",
      "Contemporary issues",
      "Case studies and discussions",
      "Research projects",
    ],
  },
]

export default function Programs() {
  const [activeTab, setActiveTab] = useState(1)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const isMobile = useMediaQuery("(max-width: 639px)")
  const isTablet = useMediaQuery("(max-width: 1023px)")

  return (
    <section id="programs" ref={ref} className="py-16 sm:py-20 md:py-24 bg-primary-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h6 className="text-primary-600 font-medium mb-2 uppercase tracking-wider text-xs sm:text-sm">
            Our Programs
          </h6>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Comprehensive Islamic Education
          </h2>
          <div className="islamic-divider w-20 sm:w-24 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Madarsa Hajira offers a variety of programs designed to provide comprehensive Islamic education for students
            of all ages and backgrounds.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center mb-6 sm:mb-8 md:mb-10 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full overflow-x-auto pb-4 flex justify-center">
            <div className="flex space-x-2 min-w-max">
              {programsData.map((program) => (
                <button
                  key={program.id}
                  onClick={() => setActiveTab(program.id)}
                  className={cn(
                    "px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    activeTab === program.id
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                      : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600",
                  )}
                >
                  {program.title}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {programsData.map((program) => (
            <div
              key={program.id}
              className={cn(
                "transition-opacity duration-300",
                activeTab === program.id ? "block opacity-100" : "hidden opacity-0",
              )}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="bg-primary-50 p-6 sm:p-8 lg:p-12">
                  <div className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 shadow-md mx-auto lg:mx-0">
                    {program.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary-800 mb-2 text-center lg:text-left">
                    {program.title}
                  </h3>
                  <h4 className="font-noto text-xl sm:text-2xl text-primary-700 mb-4 urdu text-center lg:text-right">
                    {program.urduTitle}
                  </h4>

                  <div className="space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm">Duration</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{program.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm">Age Group</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{program.ageGroup}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm">Schedule</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{program.schedule}</p>
                      </div>
                    </div>
                  </div>

                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-colors w-full">
                    Enroll Now
                  </button>
                </div>

                <div className="col-span-2 p-6 sm:p-8 lg:p-12">
                  <p className="font-noto text-base sm:text-lg text-primary-700 mb-4 urdu leading-relaxed">
                    {program.urduDescription}
                  </p>
                  <p className="text-gray-700 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                    {program.description}
                  </p>

                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Program Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    {program.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="bg-primary-100 p-1 rounded-full mt-0.5 flex-shrink-0">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
