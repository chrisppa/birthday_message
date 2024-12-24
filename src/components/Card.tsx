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
      <span className="font-handwriting text-base md:text-lg">
        {displayText}
      </span>
      {!isComplete && (
        <span className="inline-block ml-1 animate-bounce">✍️</span>
      )}
      {isComplete && (
        <div className="mt-4 text-right font-serif italic text-xl md:text-2xl text-pink-600">
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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetCard = () => {
    setIsTypingComplete(false);
    setIsMail(false);
    setIsOpen(false);
    setIsReturning(false);
  };

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(audiofile);
    audioRef.current.loop = true;

    const startAnimation = () => {
      setTimeout(() => setIsOpen(true), 3000);
    };

    startAnimation();

    // Clean up on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Function to handle audio play/pause
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Audio control component
  const AudioControl = () => (
    <button
      onClick={toggleAudio}
      className="fixed bottom-4 right-4 z-50 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
      aria-label={isPlaying ? "Pause Music" : "Play Music"}
    >
      {isPlaying ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 9v6m4-6v6"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </button>
  );

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
      const returnTimeout = setTimeout(() => {
        setIsReturning(true);
        setIsMail(false);
      }, 3000);

      return () => clearTimeout(returnTimeout);
    }
  }, [isMail]);

  useEffect(() => {
    if (isReturning) {
      const resetTimeout = setTimeout(() => {
        resetCard();
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
      <AudioControl />

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 md:w-8 h-6 md:h-8 bg-pink-200 rounded-full opacity-50"
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

      <div className="hidden md:block fixed right-0 h-full pointer-events-none">
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
        className="relative w-full max-w-3xl min-h-[600px] md:aspect-[3/2] perspective"
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

        <div className="absolute inset-0 bg-white rounded-xl shadow-2xl p-4 md:p-12 backface-hidden">
          <div className="h-full flex flex-col items-center justify-center space-y-4 md:space-y-6">
            <img
              src={front}
              alt="Birthday Girl"
              className="w-32 md:w-40 h-32 md:h-40 rounded-full border-4 border-pink-300"
            />
            <h1 className="text-2xl md:text-4xl font-bold text-pink-600">
              Happy Birthday!
            </h1>
          </div>
        </div>

        <div className="absolute inset-0 bg-white rounded-xl shadow-2xl p-4 md:p-12 backface-hidden rotate-y-180">
          <div className="h-full flex flex-col space-y-6 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
            <div className="flex flex-col justify-start space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-pink-600">
                Dear Britah👧,
              </h2>
              <div className="text-gray-700 leading-relaxed text-base md:text-lg">
                {isReturning ? (
                  message
                ) : (
                  <TypewriterText
                    text={message}
                    onComplete={() => setIsTypingComplete(true)}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start space-y-4 md:space-y-6">
              <img
                src={back}
                alt="Birthday Memories"
                className="w-48 md:w-64 h-48 md:h-80 object-cover rounded-lg shadow-lg"
              />
              <p className="text-gray-600 italic text-base md:text-lg text-center">
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
