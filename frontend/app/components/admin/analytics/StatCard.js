"use client";

import { motion } from "framer-motion";

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  progress,
  gradient,
  iconBgClass,
  iconTextClass
}) => {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
        },
      }
    }}>
      <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${iconBgClass} ${iconTextClass} group-hover:${iconBgClass.replace('bg-', 'bg-')}-200 transition-colors`}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {value}
                  </div>
                  {change && (
                    <span className="ml-2 text-xs font-medium text-green-600">
                      {change}
                    </span>
                  )}
                </div>
                <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                  <div
                    className={`${iconBgClass.replace('bg-', 'bg-')} h-1 rounded-full`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
