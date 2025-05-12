"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ValueCard from "./ValueCard";
import TeamMember from "./TeamMember";
import SectionTitle from "../shared/SectionTitle";
import { HeroSection } from "./HeroSection";
import { StatBadge } from "./StatBadge";

// Animation variants are memoized to prevent recreation on re-renders
const useAnimationVariants = () => {
  return useMemo(
    () => ({
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      },
      item: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      },
    }),
    []
  );
};

export default function AboutPageClient({ teamMembers, values, stats }) {
  const { container: containerVariants, item: itemVariants } =
    useAnimationVariants();

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <HeroSection
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Founded in 2022, our blog platform exists to democratize
                publishing and give voices to diverse perspectives from around
                the world. We believe that everyone has stories worth sharing
                and insights that can change perspectives.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our mission is to create a space where writers can express
                themselves freely, build their audience, and connect with
                like-minded individuals. We&apos;re committed to fostering a
                respectful, inclusive community that values quality content and
                meaningful interactions.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                {stats.map((stat, index) => (
                  <StatBadge
                    key={index}
                    label={stat.label}
                    value={stat.value}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-xl"
              variants={itemVariants}
            >
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
                alt="Our team collaborating"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
                style={{ objectFit: "cover" }}
                className="rounded-2xl hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Our Values"
            subtitle="These principles guide everything we do at our platform."
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.desc}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Our Team"
            subtitle="Meet the people behind our platform who work tirelessly to bring you the best experience."
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                image={member.image}
                variants={itemVariants}
              />
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl transition-colors"
                aria-label="Contact our team"
              >
                Get in Touch With Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}
