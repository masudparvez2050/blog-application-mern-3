"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import ContactFAQ from "./components/ContactFAQ";
import { submitContactForm } from "../services/contactService";
import { fadeInUp } from "../utils/animation";
import SectionTitle from "../components/shared/SectionTitle";

const ContactClient = () => {
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleSubmit = async (formData) => {
    // If resetting status
    if ("success" in formData || "error" in formData) {
      setFormStatus((prev) => ({ ...prev, ...formData }));
      return;
    }

    try {
      setFormStatus({ loading: true, success: false, error: null });

      // Short timeout to demonstrate loading state (remove in production)
      // await new Promise(resolve => setTimeout(resolve, 1000));

      await submitContactForm(formData);

      setFormStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Log analytics event (if you have analytics)
      // logAnalyticsEvent('contact_form_submitted');
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.message || "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="py-10 md:py-16 bg-gradient-to-br from-blue-50 to-sky-100"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <SectionTitle
              subtitle="Get In Touch"
              title="We'd Love to Hear From You"
              alignment="center"
            />
            <p className="text-lg text-gray-600 mt-4">
              Have a question, suggestion, or just want to say hello? We&apos;re
              here to help. Fill out the form below and we&apos;ll get back to
              you as soon as possible.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Contact Form & Info Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactForm onSubmit={handleSubmit} status={formStatus} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <ContactFAQ />
        </div>
      </section>
    </div>
  );
};

export default ContactClient;
