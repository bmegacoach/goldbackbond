/**
 * ComingSoonPage - Professional placeholder for features under development
 */

import { motion } from 'framer-motion'
import { Construction, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ComingSoonPageProps {
    title: string
    description?: string
}

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
    const navigate = useNavigate()

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg text-center"
            >
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Construction className="h-8 w-8 text-white" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>

                <p className="text-gray-400 text-lg mb-2">Coming Soon</p>

                {description && (
                    <p className="text-gray-500 text-sm mb-8">{description}</p>
                )}

                <button
                    onClick={() => navigate('/app')}
                    className="inline-flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </button>
            </motion.div>
        </div>
    )
}

export default ComingSoonPage
