import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import front from "../assets/file.jpeg";
import back from "../assets/back.jpeg";
import audiofile from "../assets/praise.mp3";

interface BalloonProps {
  delay: number;
}

const Balloon: React.FC<BalloonProps> = ({ delay }) => (
  <motion.div
    className="absolute w-16 h-20"
    initial={{ y: "200%" }}
    animate={{
      y: "-100%",
      x: [0, 10, 0],
    }}
    transition={{
      y: {
        duration: 5,
        repeat: Infinity,
        delay,
      },
      x: {
        duration: 2,
        repeat: Infinity,
        delay,
      },
    }}
  >
    <div className="w-12 h-16 bg-pink-400 rounded-full shadow-md" />
    <div className="w-0.5 h-10 bg-gray-400 mx-auto" />
  </motion.div>
);

const TypewriterText = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const index = useRef(0);

  useEffect(() => {
    if (index.current >= text.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(text.slice(0, index.current + 1));
      index.current += 1;
    }, 50);

    return () => clearTimeout(timeout);
  }, [displayText, text, onComplete, isComplete]);

  return (
    <div className="relative inline-block">
      <span className="font-handwriting">{displayText}</span>
      {!isComplete && (
        <span className="inline-block ml-1 animate-bounce">✍️</span>
      )}
      {isComplete && (
        <div className="mt-4 text-right font-serif italic text-2xl text-pink-600">
          - Chris🤓
        </div>
      )}
    </div>
  );
};
const BirthdayCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMail, setIsMail] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [audio] = useState(new Audio(audiofile));

  const resetCard = () => {
    setIsTypingComplete(false);
    setIsMail(false);
    setIsOpen(false);
    setIsReturning(false);
  };

  useEffect(() => {
    const startAnimation = () => {
      setTimeout(() => setIsOpen(true), 3000);
    };

    startAnimation();
    audio.loop = true;
    audio.play().catch((e) => console.log("Audio playback failed:", e));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  useEffect(() => {
    if (isTypingComplete) {
      const mailTimeout = setTimeout(() => {
        setIsMail(true);
      }, 1000);

      return () => clearTimeout(mailTimeout);
    }
  }, [isTypingComplete]);

  useEffect(() => {
    if (isMail) {
      // After mail animation completes, start return sequence
      const returnTimeout = setTimeout(() => {
        setIsReturning(true);
        setIsMail(false);
      }, 3000);

      return () => clearTimeout(returnTimeout);
    }
  }, [isMail]);

  useEffect(() => {
    if (isReturning) {
      // After return animation, reset the card
      const resetTimeout = setTimeout(() => {
        resetCard();
        // Start the cycle again
        setTimeout(() => setIsOpen(true), 1000);
      }, 1500);

      return () => clearTimeout(resetTimeout);
    }
  }, [isReturning]);

  const cardVariants = {
    closed: {
      rotateY: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      rotateZ: 0,
    },
    open: {
      rotateY: -180,
      x: 0,
      scale: 1,
      rotateX: 0,
      rotateZ: 0,
    },
    mail: {
      rotateY: 45,
      rotateX: 45,
      rotateZ: -25,
      x: window.innerWidth + 200,
      y: -200,
      scale: 0.5,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
    returning: {
      rotateY: 0,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateZ: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const PaperPlaneWings = () => (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMail ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute left-0 top-1/2 w-16 h-24 bg-white/80 -rotate-45 transform origin-top-right shadow-lg" />
      <div className="absolute right-0 top-1/2 w-16 h-24 bg-white/80 rotate-45 transform origin-top-left shadow-lg" />
      <div className="absolute bottom-0 left-1/2 w-8 h-12 bg-white/80 rotate-45 transform -translate-x-1/2 origin-top shadow-lg" />
    </motion.div>
  );

  const message = `Wishing you a truly blessed and joyful birthday! May this special day remind you of how wonderfully God has created you and how deeply you are loved. I pray that the year ahead is filled with His guidance, abundant blessings, and countless reasons to smile.

May His grace continue to shine through you, touching the lives of everyone around you. Have a fantastic day filled with laughter, love, and the warmth of His presence.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-pink-200 rounded-full opacity-50"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="fixed right-0 h-full pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <Balloon key={i} delay={i * 0.5} />
        ))}
      </div>

      <Confetti
        numberOfPieces={500}
        recycle={true}
        className="fixed inset-0 pointer-events-none"
      />

      <motion.div
        className="relative w-full max-w-3xl aspect-[3/2] perspective"
        animate={
          isMail
            ? "mail"
            : isReturning
            ? "returning"
            : isOpen
            ? "open"
            : "closed"
        }
        variants={cardVariants}
        transition={{ duration: 2.5 }}
      >
        <PaperPlaneWings />

        <div className="absolute inset-0 bg-white rounded-xl shadow-2xl p-12 backface-hidden">
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <img
              src={front}
              alt="Birthday Girl"
              className="w-40 h-40 rounded-full border-4 border-pink-300"
            />
            <h1 className="text-4xl font-bold text-pink-600">
              Happy Birthday!
            </h1>
          </div>
        </div>

        <div className="absolute inset-0 bg-white rounded-xl shadow-2xl p-12 backface-hidden rotate-y-180">
          <div className="h-full grid grid-cols-2 gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-semibold text-pink-600">
                Dear Britah👧,
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {isReturning ? (
                  message
                ) : (
                  <TypewriterText
                    text={message}
                    onComplete={() => setIsTypingComplete(true)}
                  />
                )}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-6">
              <img
                src={back}
                alt="Birthday Memories"
                className="w-64 h-80 object-cover rounded-lg shadow-lg"
              />
              <p className="text-gray-600 italic text-lg text-center">
                Happy Birthday and God bless you always! 🙏💖✨
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BirthdayCard;
