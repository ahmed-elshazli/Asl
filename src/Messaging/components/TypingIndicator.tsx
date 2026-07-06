import { motion } from 'motion/react';

/**
 * مؤشر الكتابة — 3 نقاط متحركة داخل فقاعة رسالة المستقبل
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white border border-primary/10 px-5 py-3 rounded-2xl rounded-br-sm shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 bg-primary/50 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
