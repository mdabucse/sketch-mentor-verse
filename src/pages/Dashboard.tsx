import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Video, BarChart, FileText, Image, Plus, Clock, BookOpen, Youtube } from 'lucide-react';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { useEffect } from 'react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { trackPageView, trackFeatureUsage } = useActivityTracker();

  useEffect(() => {
    // Track dashboard page view
    trackPageView('Dashboard');
  }, []);

  const handleFeatureClick = async (featureName: string, href: string) => {
    await trackFeatureUsage('dashboard', 'feature_accessed', {
      feature_name: featureName,
      destination: href
    });
  };

  const features = [
    {
      title: 'Video Generator',
      description: 'Create educational videos from Manim code',
      icon: Video,
      href: '/video-generator',
      color: 'from-red-500 to-pink-500',
      recent: 'Last used 2 hours ago'
    },
    {
      title: 'Graph Visualizer',
      description: 'Plot and analyze mathematical functions',
      icon: BarChart,
      href: '/graph-visualizer',
      color: 'from-blue-500 to-cyan-500',
      recent: 'Never used'
    },
    {
      title: 'Document Analyzer',
      description: 'Extract insights from uploaded documents',
      icon: FileText,
      href: '/document-analyzer',
      color: 'from-green-500 to-emerald-500',
      recent: 'Last used yesterday'
    },
    {
      title: 'Canvas AI',
      description: 'Solve handwritten equations with AI',
      icon: Image,
      href: '/canvas-ai',
      color: 'from-purple-500 to-indigo-500',
      recent: 'Never used'
    },
    {
      title: 'YouTube Transcriber',
      description: 'Transcribe and chat with YouTube videos',
      icon: Youtube,
      href: '/youtube-transcriber',
      color: 'from-orange-500 to-red-500',
      recent: 'Never used'
    }
  ];

  const recentActivity = [
    {
      type: 'video',
      title: 'Linear Algebra Visualization',
      time: '2 hours ago',
      status: 'Completed'
    },
    {
      type: 'youtube',
      title: 'Khan Academy: Calculus Basics',
      time: '5 hours ago',
      status: 'Transcribed'
    },
    {
      type: 'document',
      title: 'Calculus Textbook Analysis',
      time: '1 day ago',
      status: 'In Progress'
    },
    {
      type: 'graph',
      title: 'Trigonometric Functions',
      time: '3 days ago',
      status: 'Completed'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {currentUser?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your learning journey with SketchMentor's AI-powered tools.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={feature.href}
                  onClick={() => handleFeatureClick(feature.title, feature.href)}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white dark:bg-gray-800">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {feature.recent}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity and Quick Start */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : activity.status === 'Transcribed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Start Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Getting Started
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    New to SketchMentor? Try these features first!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first video with our Video Generator
                    </div>
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Transcribe a YouTube video and chat about it
                    </div>
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Visualize functions with the Graph Visualizer
                    </div>
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload a document to analyze and create quizzes
                    </div>
                    <Button variant="secondary" className="w-full mt-4">
                      View Tutorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
