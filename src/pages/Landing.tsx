import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import {
  Video, BarChart, FileText, Image, CheckCircle, Users, Star, ArrowRight, Play, Youtube
} from 'lucide-react';

const Landing = () => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Video,
      title: "AI Video Generator",
      description: "Transform mathematical concepts into engaging educational videos using advanced Manim integration and AI-powered narration.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: BarChart,
      title: "Interactive Graph Visualizer",
      description: "Create stunning 2D and 3D mathematical visualizations with real-time plotting and interactive exploration tools.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Smart Document Analyzer",
      description: "Upload educational content and automatically generate quizzes, flashcards, and personalized learning pathways.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Image,
      title: "Canvas AI Solver",
      description: "Draw mathematical equations by hand and get instant step-by-step solutions with detailed explanations.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Youtube,
      title: "YouTube Transcriber",
      description: "Extract transcriptions from educational videos and chat with AI to deepen your understanding of the content.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    "Accelerate learning with AI-powered explanations",
    "Visual learning through interactive content",
    "Personalized study materials generation",
    "24/7 intelligent tutoring assistance",
    "Multi-modal learning approach",
    "Real-time problem solving support"
  ];

  const stats = [
    { number: "50K+", label: "Active Learners" },
    { number: "1M+", label: "Problems Solved" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/5 dark:to-blue-400/5"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Master Mathematics</span>
              <br />
              <span className="text-gray-900 dark:text-white">with AI-Powered Learning</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your learning experience with cutting-edge AI tools that make complex mathematical concepts intuitive and engaging through interactive videos, visualizations, and personalized tutoring.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setShowDemo(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {showDemo && (
            <div className="mt-8 relative aspect-video max-w-4xl mx-auto">
              <iframe
                className="w-full h-full rounded-xl shadow-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </motion.section>

      {/* Remaining sections unchanged... */}
    </div>
  );
};

export default Landing;
