
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Play, Send, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const YouTubeTranscriber = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [transcription, setTranscription] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLoadVideo = () => {
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
      // Simulate transcription loading
      setLoading(true);
      setTimeout(() => {
        setTranscription(
          "This is a sample transcription of the YouTube video. In a real implementation, you would use a service like YouTube's API or a third-party transcription service to get the actual transcript.\n\n" +
          "The video discusses various topics and provides valuable insights. The speaker talks about different concepts and explains them in detail.\n\n" +
          "You can now chat with the bot about this content using the chat interface on the right."
        );
        setLoading(false);
      }, 2000);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I understand you're asking about: "${chatInput}". Based on the video transcription, I can help you analyze the content. This is a simulated response - in a real implementation, this would be powered by an AI that can analyze the transcription content.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            YouTube Transcriber
          </h1>
          
          {/* URL Input */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                YouTube Video URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleLoadVideo} disabled={loading}>
                  {loading ? 'Loading...' : 'Load Video'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Left Column - Video and Transcription */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              {videoId && (
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="w-full h-full rounded"
                        allowFullScreen
                        title="YouTube video player"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transcription */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 lg:h-80">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading transcription...</div>
                      </div>
                    ) : transcription ? (
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {transcription}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Load a YouTube video to see its transcription
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Chat Bot */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4 gap-4">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm">
                        Start chatting about the video content!
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              message.type === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about the video content..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[40px] max-h-[100px] resize-none"
                    disabled={!transcription}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || !transcription}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTranscriber;
