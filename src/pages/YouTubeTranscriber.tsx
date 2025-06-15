
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Youtube, Send, MessageCircle, Loader, Play } from 'lucide-react';
import { useUserActivities } from '@/hooks/useUserActivities';

const YouTubeTranscriber = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [videoId, setVideoId] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'bot', message: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { trackActivity } = useUserActivities();

  // Track page access when component mounts
  useEffect(() => {
    trackActivity('page_visited', { 
      page: 'YouTube Transcriber',
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  const extractVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const transcribeVideo = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsTranscribing(true);
    console.log('Transcribing YouTube video:', youtubeUrl);
    
    const extractedVideoId = extractVideoId(youtubeUrl);
    if (extractedVideoId) {
      setVideoId(extractedVideoId);
    }
    
    // Track YouTube transcription activity
    trackActivity('youtube_transcribed', { 
      url: youtubeUrl,
      timestamp: new Date().toISOString()
    });
    
    // Simulate transcription process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setTranscript(`Sample transcript from the YouTube video:

[0:00] Welcome to this amazing tutorial about web development.
[0:15] Today we'll be learning about React, TypeScript, and modern web technologies.
[0:30] First, let's start by understanding the basics of component architecture.
[0:45] React components are the building blocks of any React application.
[1:00] They allow us to break down complex UIs into smaller, manageable pieces.
[1:15] TypeScript adds type safety to our JavaScript code, making it more reliable.
[1:30] This helps catch errors during development rather than in production.
[1:45] Now let's dive into some practical examples of how to build components.
[2:00] We'll start with a simple functional component and gradually add more features.

This is a sample transcript. In a real implementation, this would be the actual transcribed text from the YouTube video.`);
    setIsTranscribing(false);
  };

  const sendChatMessage = async () => {
    if (!currentMessage.trim() || !transcript) return;
    
    const userMessage = currentMessage;
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setCurrentMessage('');
    setIsChatLoading(true);
    
    // Simulate bot response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const botResponse = `Based on the video transcript, I can help you with that. The video discusses ${userMessage.toLowerCase().includes('react') ? 'React components and their architecture' : 'web development concepts and best practices'}. Would you like me to explain any specific part in more detail?`;
    
    setChatMessages(prev => [...prev, { role: 'bot', message: botResponse }]);
    setIsChatLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
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
              <Youtube className="h-8 w-8 mr-3 text-red-600" />
              YouTube Transcriber
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Transcribe and chat with YouTube videos.
            </p>
          </div>

          {/* URL Input */}
          <Card className="mb-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Youtube className="h-5 w-5 mr-2 text-red-600" />
                Video URL
              </CardTitle>
              <CardDescription>
                Enter the YouTube video URL to transcribe and analyze.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={transcribeVideo}
                  disabled={isTranscribing}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  {isTranscribing ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <Youtube className="h-4 w-4 mr-2" />
                      Transcribe
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video and Transcript */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Player */}
              {videoId && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="h-5 w-5 mr-2 text-red-600" />
                      Video Player
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transcript */}
              {transcript && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Video Transcript
                    </CardTitle>
                    <CardDescription>
                      Transcribed text from the YouTube video.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                        {transcript}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Chatbot */}
            <Card className="bg-white dark:bg-gray-800 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  Chat with Video
                </CardTitle>
                <CardDescription>
                  Ask questions about the video content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!transcript ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Transcribe a video first to start chatting about its content.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-64 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {chatMessages.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                          Start a conversation about the video content...
                        </p>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                msg.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        ))
                      )}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white dark:bg-gray-600 text-gray-900 dark:text-white p-3 rounded-lg text-sm">
                            <Loader className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask about the video content..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 resize-none"
                        rows={2}
                      />
                      <Button
                        onClick={sendChatMessage}
                        disabled={!currentMessage.trim() || isChatLoading}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default YouTubeTranscriber;
