
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Play, Download, Code, Video } from 'lucide-react';

const VideoGenerator = () => {
  const [code, setCode] = useState(`from manim import *

class CreateCircle(Scene):
    def construct(self):
        circle = Circle()
        circle.set_fill(PINK, opacity=0.5)
        self.play(Create(circle))`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      setVideoUrl('https://example.com/demo-video.mp4');
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Video className="h-8 w-8 mr-3 text-purple-600" />
              Video Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create educational videos from Manim code with AI-powered explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Editor */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Manim Code Editor
                </CardTitle>
                <CardDescription>
                  Write your Manim code to generate educational videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code">Python Code</Label>
                    <Textarea
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="Enter your Manim code here..."
                    />
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>Generating Video...</>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Video Preview</CardTitle>
                <CardDescription>
                  Generated video will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Generating video...</p>
                    </div>
                  </div>
                ) : videoUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <p className="text-white">Video Player (Demo)</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">No video generated yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Examples */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Click on any example to load it in the editor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <h4 className="font-semibold mb-2">Basic Circle Animation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create and animate a simple circle</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <h4 className="font-semibold mb-2">Mathematical Equations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Display and transform mathematical expressions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoGenerator;
