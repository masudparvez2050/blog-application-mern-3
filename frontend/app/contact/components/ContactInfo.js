"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const ContactInfo = memo(function ContactInfo() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const contactDetails = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Address",
      content: "123 Blog Street, Tech Valley, CA 94043, United States",
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      colorClass: "bg-green-50 text-green-600",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      content: "contact@blogapp.com",
      link: "mailto:contact@blogapp.com",
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Office Hours",
      content: "Monday - Friday: 9AM - 5PM",
      colorClass: "bg-amber-50 text-amber-600",
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      name: "Facebook",
      link: "https://facebook.com",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      name: "Twitter",
      link: "https://twitter.com",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      name: "Instagram",
      link: "https://instagram.com",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      name: "LinkedIn",
      link: "https://linkedin.com",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-6 md:p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Information
        </h2>
        <div className="space-y-4">
          {contactDetails.map((detail, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              variants={itemVariants}
            >
              <div className={`${detail.colorClass} p-2 rounded-full`}>
                {detail.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{detail.title}</h3>
                {detail.link ? (
                  <a
                    href={detail.link}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {detail.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{detail.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-6 md:p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              variants={itemVariants}
              aria-label={`Follow us on ${social.name}`}
            >
              {social.icon}
              <span>{social.name}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Google Maps (Embed) */}
      <motion.div
        className="rounded-xl overflow-hidden shadow-sm h-48 sm:h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <iframe
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.7462061883306!2d-122.08454492374092!3d37.42209997169693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba027c4032f5%3A0x6a0fa846388e786c!2sGooglePlex!5e0!3m2!1sen!2sus!4v1672148273154!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </div>
  );
});

export default ContactInfo;
