import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faRotateRight,
  faTimes,
  faDivide,
  faMoon,
  faSun,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import Particles from '@tsparticles/react';
import { loadSlim } from "tsparticles-slim";
import ReactConfetti from 'react-confetti';
import './Counter.css';

const Counter = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("count");
    return saved !== null ? JSON.parse(saved) : 0;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [milestone, setMilestone] = useState(false);

  useEffect(() => {
    localStorage.setItem("count", JSON.stringify(count));
    // Check for milestones (multiples of 10)
    if (count !== 0 && count % 10 === 0) {
      setShowConfetti(true);
      setMilestone(true);
      setTimeout(() => {
        setShowConfetti(false);
        setMilestone(false);
      }, 3000);
    }
  }, [count]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleCount = (fn) => {
    setCount(fn);
  };

  const particlesConfig = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: darkMode ? "#ffffff" : "#000000"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5,
        random: true
      },
      size: {
        value: 3,
        random: true
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        out_mode: "out"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      boxShadow: darkMode ? 
        "0 0 15px rgba(255, 255, 255, 0.5)" : 
        "0 0 15px rgba(0, 0, 0, 0.3)"
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`counter-wrapper ${darkMode ? 'dark' : 'light'}`}>      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
      <Particles init={particlesInit} options={particlesConfig} className="particles" />

      <motion.div 
        className="counter-glass"
        animate={{
          boxShadow: milestone ? 
            "0 0 30px rgba(255, 215, 0, 0.6)" : 
            darkMode ? 
              "0 8px 32px rgba(255, 255, 255, 0.2)" : 
              "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="title"
        >
          <FontAwesomeIcon icon={faFire} className="fire-icon left" />
          Cosmic Counter
          <FontAwesomeIcon icon={faFire} className="fire-icon right" />
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            className={`count-display ${milestone ? 'milestone' : ''}`}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotate: milestone ? [0, 360] : 0
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ 
              duration: 0.5,
              rotate: { duration: 0.8, ease: "easeOut" }
            }}
          >
            {count}
          </motion.div>
        </AnimatePresence>

        <div className="button-group">
          {[
            { icon: faPlus, action: (prev) => prev + 1 },
            { icon: faMinus, action: (prev) => prev - 1 },
            { icon: faTimes, label: "×2", action: (prev) => prev * 2 },
            { icon: faDivide, label: "÷2", action: (prev) => Math.floor(prev / 2) },
            { icon: faRotateRight, action: () => 0 }
          ].map((btn, index) => (
            <motion.button
              key={index}
              onClick={() => handleCount(btn.action)}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="cosmic-button"
            >
              <FontAwesomeIcon icon={btn.icon} />
              {btn.label}
            </motion.button>
          ))}
        </div>

        <motion.button
          className="toggle-mode cosmic-button"
          onClick={() => setDarkMode(prev => !prev)}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          {darkMode ? ' Light Mode' : ' Dark Mode'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Counter;
