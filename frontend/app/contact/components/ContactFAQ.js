"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How quickly can I expect a response to my inquiry?",
    answer:
      "We strive to respond to all inquiries within 24-48 business hours. For urgent matters, we recommend including 'Urgent' in your subject line or contacting us via phone.",
  },
  {
    question: "Can I contribute content to the blog?",
    answer:
      "Yes! We welcome guest authors and contributors. Please use the contact form with the subject 'Content Contribution' and include details about your proposed topic and a brief writing sample or portfolio link.",
  },
  {
    question: "I found incorrect information on the blog. How do I report it?",
    answer:
      "We appreciate your feedback and commitment to accuracy. Please use the contact form with the subject 'Correction Request' and provide details about the article, the incorrect information, and any sources to verify the correct information.",
  },
  {
    question: "How do I collaborate or advertise on the blog?",
    answer:
      "For collaboration, sponsorship, or advertising opportunities, please reach out with the subject 'Business Inquiry' and include details about your company and what type of partnership you're interested in. Our business team will get back to you with available options.",
  },
  {
    question: "I'm having technical issues with the website. What should I do?",
    answer:
      "We're sorry you're experiencing technical difficulties. Please provide details about the issue (including what device and browser you're using), any error messages you see, and steps to reproduce the problem. Screenshots are also helpful if applicable.",
  },
];

const FAQ = memo(function ContactFAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find quick answers to common questions. If you don&apos;t see what
          you&apos;re looking for, feel free to contact us directly.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => toggleItem(index)}
              aria-expanded={openItem === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {faq.question}
              </h3>
              {openItem === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {openItem === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-2">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

export default FAQ;
