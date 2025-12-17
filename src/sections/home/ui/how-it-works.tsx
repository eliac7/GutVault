"use client";

import { motion } from "motion/react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Press & hold to record",
      desc: "Speak naturally about your meal or symptoms.",
    },
    {
      title: "Stateless Extraction",
      desc: "Gemini processes speech to JSON instantly.",
    },
    {
      title: "Save Locally",
      desc: "Structured data saved to Dexie.js (IndexedDB).",
    },
    {
      title: "Visualize Patterns",
      desc: "View local charts to find triggers.",
    },
  ];

  return (
    <motion.section
      id="how-it-works"
      className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            How it works
          </h2>
        </motion.div>

        <div className="relative">
          {/* Desktop connecting line */}
          <motion.div
            className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ originX: 0 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col md:text-center group items-center"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                <motion.div
                  className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-sm z-10 group-hover:border-emerald-500 dark:group-hover:border-emerald-400 transition-colors duration-300"
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgb(16, 185, 129)", // emerald-500
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-3xl font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    0{i + 1}
                  </span>
                </motion.div>

                <motion.h3
                  className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-slate-500 dark:text-slate-400 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {step.desc}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
