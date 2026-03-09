import { motion } from 'framer-motion'

const FloatingGoldParticles = () => {
    const particles = Array.from({ length: 20 })

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        opacity: 0,
                    }}
                    animate={{
                        y: [null, '-20%', '120%'],
                        opacity: [0, 0.4, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 20,
                    }}
                />
            ))}
        </div>
    )
}

export default FloatingGoldParticles
