"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

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
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-4"></p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/prayar.png"
                alt="Madarsa Hajira Building"
                fill
                className="object-cover"
              />
            </div>
           
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl font-bold text-primary-800 mb-3 sm:mb-4"
            >
              Our Mission
            </motion.h3>

            <motion.div
              variants={itemVariants}
              className="mb-3 sm:mb-4 md:mb-6"
            >
           
              <p className="text-gray-600 text-md font-bold sm:text-sm italic">
                "Empowering students with Quranic knowledge and Islamic values"
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 mb-3 sm:mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-base text-justify"
            >
              Welcome to Al Quran Institute Online! Al Quran Institute Online is
              dedicated to providing comprehensive and accessible Quranic
              education services. We offer a diverse range of Islamic courses
              designed to foster proficiency in Quran recitation, deepen
              understanding of its teachings, cultivate strong character, and
              inspire life reformation, all in strict adherence to Sharia
              principles. Our proven online classes have successfully guided
              numerous students, both within Pakistan and globally, in their
              journey to read and comprehend the Holy Quran. We are proud to
              offer our services 24 hours a day, 7 days a week, providing
              unparalleled flexibility for learners to schedule classes at their
              convenience. We earnestly encourage all Muslim brothers and
              sisters to enroll with Al Quran Institute Online. Fulfilling the
              sacred duty of not only reciting the Holy Quran but also
              internalizing its profound meaning is a paramount endeavor. If you
              or your loved ones aspire to enhance Quranic recitation, we invite
              you to take this transformative step today and illuminate your
              hearts with the divine words of Almighty Allah. Join Al Quran
              Institute Online now and benefit from our continuous online Quran
              teaching services.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8"
            >
              <div className="bg-primary-50 p-4 md:p-6 rounded-lg border-l-4 border-primary-600">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Our Vision
                </h4>
                <p className="text-gray-700 text-sm md:text-base">
                  To be a leading institution that produces scholars who combine
                  deep Islamic knowledge with exemplary character.
                </p>
              </div>
              <div className="bg-primary-50 p-4 md:p-6 rounded-lg border-l-4 border-primary-600">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Our Values
                </h4>
                <p className="text-gray-700 text-sm md:text-base">
                  Excellence, integrity, compassion, and dedication to lifelong
                  learning and spiritual growth.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                What Sets Us Apart
              </h4>
              <ul className="space-y-2">
                {[
                  "What Sets Us Apart",
                  "Expert & Certified Online Instructors",
                  "Structured Quran Curriculum with Tajweed & Tafsir",
                  "Focus on Character Building & Spiritual Growth",
                  "Interactive Online Learning Experience",
                  "Flexible Timings for Global Students",
                  "1-on-1 and Group Classes Available",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
