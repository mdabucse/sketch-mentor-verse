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

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Powerful AI Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our comprehensive suite of AI-powered learning tools designed to revolutionize your educational experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="text-gray-900 dark:text-white">Why Choose</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Our Platform?
                </span>
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center space-x-4"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl p-8 text-white">
                <Users className="h-16 w-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                <p className="text-purple-100 mb-6">
                  Connect with thousands of learners worldwide and share your educational journey.
                </p>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-2 text-sm">4.9/5 from 10,000+ reviews</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Ready to Transform</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Learning?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already revolutionized their educational experience with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                MathAI Platform
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Revolutionizing education through AI-powered learning tools that make complex mathematical concepts accessible and engaging for everyone.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  LinkedIn
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  GitHub
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/features" className="hover:text-white transition-colors">AI Video Generator</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Graph Visualizer</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Document Analyzer</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Canvas AI Solver</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">YouTube Transcriber</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0 h-auto">About Us</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0 h-auto">Contact</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0 h-auto">Privacy Policy</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0 h-auto">Terms of Service</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MathAI Platform. All rights reserved. Empowering learners worldwide with AI-powered education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
