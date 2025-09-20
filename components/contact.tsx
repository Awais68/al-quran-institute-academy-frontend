"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/app/constant/constant";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const data = { ...formData };

    // Simulate form submission
    try {
      const response = await axios.post(AppRoutes.contact, data);

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-12 sm:py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h6 className="text-primary-600 font-medium mb-2 uppercase tracking-wider text-xs sm:text-sm">
            Contact Us
          </h6>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Get In Touch With Us
          </h2>
          <div className="islamic-divider w-16 sm:w-20 md:w-24 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-600 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Have questions about our programs or want to enroll? Get in touch
            with us and we'll be happy to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12">
          <motion.div
            className="lg:col-span-3 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Send Us a Message
            </h3>

            <form
              onSubmit={handleSubmitContact}
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn("text-sm", errors.name && "border-red-500")}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn("text-sm", errors.email && "border-red-500")}
                    placeholder="Your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="text-sm"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={cn(
                      "text-sm",
                      errors.subject && "border-red-500"
                    )}
                    placeholder="Message subject"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={cn(
                    "min-h-[100px] sm:min-h-[120px] md:min-h-[150px] text-sm",
                    errors.message && "border-red-500"
                  )}
                  placeholder="Your message"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm h-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              {submitSuccess && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs sm:text-sm">
                  Thank you for your message! We will get back to you soon.
                </div>
              )}
            </form>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-primary-900 text-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 h-full islamic-pattern-light">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6">
                Contact Information
              </h3>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex items-start"></div>

                <div className="flex items-start">
                  <div className="bg-primary-800/50 p-2 rounded-full mr-3">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-accent-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-100 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                      Phone
                    </h4>
                    <p className="text-white text-xs md:text-sm">
                      +92-340-3201940
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-800/50 p-2 rounded-full mr-3">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-accent-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-100 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                      Email
                    </h4>
                    <p className="text-white text-xs md:text-sm">
                      aqionline786@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-800/50 p-2 rounded-full mr-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-accent-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-100 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                      Office Hours
                    </h4>
                    <p className="text-white text-xs md:text-sm">
                      Always Open 24/7
                    </p>
                    {/* <p className="text-white text-xs md:text-sm">
                      Saturday: 9:00 AM - 1:00 PM
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
