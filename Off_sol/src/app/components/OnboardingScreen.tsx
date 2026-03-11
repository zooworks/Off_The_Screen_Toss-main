import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Onboarding2 from '@/app/components/onboarding/Onboarding2';

interface OnboardingScreenProps {
    onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [hasAnimated, setHasAnimated] = useState(false);
    const [showFirstText, setShowFirstText] = useState(false);
    const [showSecondText, setShowSecondText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasAnimated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (hasAnimated) {
            // 1. Show Text1, Text2
            const timer1 = setTimeout(() => {
                setShowFirstText(true);
                setShowSecondText(true);
            }, 2000);

            // 2. Transition to Login after 4.5 seconds (2.0s delay + ~2.5s reading time)
            const timer2 = setTimeout(() => {
                onComplete();
            }, 4500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [hasAnimated, onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gradient-to-b from-[#A798E7] to-white overflow-hidden">
            <motion.div
                initial={{ y: '100%', filter: 'grayscale(100%)' }}
                animate={hasAnimated ? { y: 0, filter: 'grayscale(0%)' } : {}}
                transition={{
                    duration: 2.5,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full h-full flex items-end justify-center relative"
            >
                <div className="relative w-full h-full translate-y-16">
                    <Onboarding2 />

                    {/* Hide and show text elements with CSS */}
                    <style>{`
            [data-name="OFF THE SCREEN"] {
              opacity: ${showFirstText ? 1 : 0};
              transform: translateY(${showFirstText ? 0 : 20}px);
              transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .subtitle-text {
              opacity: ${showSecondText ? 1 : 0};
              transform: translateY(${showSecondText ? 0 : 20}px);
              transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1);
            }
          `}</style>
                </div>
            </motion.div>
        </div>
    );
}
