import { motion } from 'motion/react';
import type { ComponentProps, ElementType } from 'react';

interface AnimatedTextProps extends Omit<ComponentProps<typeof motion.span>, "children"> {
  text: string;
  el?: ElementType;
  className?: string;
  staggerDelay?: number;
}

const defaultContainer = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number = 0.02) => ({
    opacity: 1,
    transition: { staggerChildren: staggerDelay },
  }),
};

const defaultItem: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 150,
    },
  },
};

export const AnimatedText = ({
  text,
  el: Wrapper = 'span',
  className = '',
  staggerDelay = 0.05,
  ...props
}: AnimatedTextProps) => {
  // للغة العربية، نفصل بالكلمات
  const words = text.split(' ');

  // إنشاء المكون المتحرك بناءً على العنصر الممرر (بدون إعادة إنشائه مع كل ريندر)
  const Tag = Wrapper as any;

  return (
    <Tag className={className} aria-label={text}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        variants={defaultContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        custom={staggerDelay}
        className="inline-block"
        {...(props as any)}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            <motion.span
              className="inline-block"
              variants={defaultItem}
            >
              {word}
            </motion.span>
            {/* إضافة مسافة بين الكلمات */}
            {wordIndex !== words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};
