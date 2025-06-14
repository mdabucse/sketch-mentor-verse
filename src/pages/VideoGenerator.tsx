
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Play, Download, Wand2, Video, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a question to generate a video');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('Please enter your API key');
      return;
    }
    
    setIsGenerating(true);
    setVideoUrl('');

    try {
      // Replace this URL with your actual video generation API endpoint
      const response = await fetch('https://your-api-endpoint.com/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          // Add any other parameters your API needs
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Assuming the API returns a video URL in the response
      // Adjust this based on your actual API response structure
      if (data.videoUrl || data.video_url || data.url) {
        const generatedVideoUrl = data.videoUrl || data.video_url || data.url;
        setVideoUrl(generatedVideoUrl);
        toast.success('Video generated successfully!');
      } else {
        throw new Error('No video URL found in API response');
      }

    } catch (error) {
      console.error('Error generating video:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'generated-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const examplePrompts = [
    {
      title: "Pythagorean Theorem",
      description: "Explain the Pythagorean theorem with visual proof",
      prompt: "Explain the Pythagorean theorem with a visual demonstration"
    },
    {
      title: "Photosynthesis Process",
      description: "Illustrate how plants convert sunlight to energy",
      prompt: "How does photosynthesis work in plants?"
    },
    {
      title: "Solar System Tour",
      description: "Take a journey through our solar system",
      prompt: "Take me on a tour of our solar system"
    },
    {
      title: "DNA Structure",
      description: "Visualize the double helix structure of DNA",
      prompt: "What is the structure of DNA and how does it work?"
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Video className="h-8 w-8 mr-3 text-purple-600" />
              AI Video Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create educational videos from simple text prompts using AI-powered animation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prompt Input */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="h-5 w-5 mr-2" />
                  What do you want to learn?
                </CardTitle>
                <CardDescription>
                  Ask any question and we'll create an educational video to explain it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                      API Key
                    </label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="mb-4"
                    />
                  </div>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[200px]"
                    placeholder="Ask any question you want to learn about. For example: 'How does gravity work?', 'Explain photosynthesis', 'What is the Pythagorean theorem?'"
                  />
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Creating Video...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Create Video
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Your Video</CardTitle>
                <CardDescription>
                  Generated video will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                        <Sparkles className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">AI is creating your video...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This may take a few moments</p>
                    </div>
                  </div>
                ) : videoUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-full object-contain"
                        poster="/placeholder.svg"
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Play Video
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Ask a question to generate your video</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">AI will create educational content based on your question</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Example Prompts */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Example Questions
              </CardTitle>
              <CardDescription>Click on any example to load it as your question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examplePrompts.map((example, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                    onClick={() => setPrompt(example.prompt)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{example.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{example.description}</p>
                        <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                          <Clock className="h-3 w-3 mr-1" />
                          Click to use this question
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoGenerator;
