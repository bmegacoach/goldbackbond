import { motion } from 'framer-motion'
import { Coins, Shield, TrendingUp, Globe, Zap, Lock, Star, Sparkles } from 'lucide-react'

const AnimatedBackground = () => {
  const icons = [
    { Icon: Coins, delay: 0 },
    { Icon: Shield, delay: 0.5 },
    { Icon: TrendingUp, delay: 1 },
    { Icon: Globe, delay: 1.5 },
    { Icon: Zap, delay: 2 },
    { Icon: Lock, delay: 2.5 },
    { Icon: Star, delay: 3 },
    { Icon: Sparkles, delay: 3.5 }
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Universe background with stars */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        {/* Animated stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Central GoldBackBond logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative z-10"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <img
            src="/images/goldbackbond-transparent.png"
            alt="GoldBackBond Logo"
            className="w-32 h-32 md:w-48 md:h-48 opacity-20 hover:opacity-30 transition-opacity duration-300 object-contain"
          />
        </motion.div>
      </div>

      {/* Circulating icons around the logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        {icons.map(({ Icon, delay }, index) => {
          const radius = 200 + (index % 3) * 50 // Multiple orbital rings
          const angle = (index * 360) / icons.length
          
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                width: '40px',
                height: '40px',
              }}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 20 + (index % 3) * 10, // Different speeds for each ring
                repeat: Infinity,
                ease: "linear",
                delay: delay
              }}
            >
              <motion.div
                className="w-full h-full flex items-center justify-center"
                style={{
                  transform: `translateX(${radius}px) translateY(0px)`,
                }}
                animate={{
                  rotate: -360 // Counter-rotate to keep icons upright
                }}
                transition={{
                  duration: 20 + (index % 3) * 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg opacity-60 hover:opacity-80 transition-opacity">
                  <Icon className="w-4 h-4 text-black" />
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
        />
      ))}

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  )
}

export default AnimatedBackground