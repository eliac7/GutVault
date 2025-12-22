"use client";

import { Card } from "@/shared/ui/card";
import { Sparkles, Brain, Heart, RefreshCw } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/shared/ui/button";

const MESSAGES = [
  {
    icon: Sparkles,
    title: "This will pass",
    text: "You've handled this before, and you can handle it now. Your body knows how to heal. Take it one moment at a time.",
  },
  {
    icon: Brain,
    title: "Gut-Brain Connection",
    text: "Your gut and brain are talking constantly. Calming your mind can directly signal safety to your gut, helping to reduce pain and urgency.",
  },
  {
    icon: Heart,
    title: "You are safe",
    text: "These sensations are uncomfortable, but they are not dangerous. Acknowledge them without judgment and let them float by.",
  },
];

export function ReassuranceCard() {
  const [index, setIndex] = useState(0);

  const nextMessage = () => {
    setIndex((prev) => (prev + 1) % MESSAGES.length);
  };

  const CurrentIcon = MESSAGES[index].icon;

  return (
    <Card className="relative overflow-hidden p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/50">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-start gap-4"
        >
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full shrink-0">
            <CurrentIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
              {MESSAGES[index].title}
            </h3>
            <p className="text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed">
              {MESSAGES[index].text}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextMessage}
        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 rounded-full"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </Card>
  );
}
