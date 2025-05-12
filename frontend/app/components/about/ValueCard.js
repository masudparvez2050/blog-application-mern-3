"use client";

import { motion } from "framer-motion";
import { Globe, Sparkles, ShieldCheck, Users, Bolt, Scale } from "lucide-react";

// Icons mapped to their components
const ICON_MAP = {
  globe: Globe,
  sparkle: Sparkles,
  shield: ShieldCheck,
  users: Users,
  bolt: Bolt,
  scale: Scale,
};

export default function ValueCard({ icon, title, description, variants }) {
  // Get the corresponding icon component or fallback to Sparkles
  const IconComponent = ICON_MAP[icon.toLowerCase()] || Sparkles;

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
      variants={variants}
      whileHover={{ y: -5 }}
    >
      <div className="bg-blue-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
        <IconComponent className="text-blue-600 w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
