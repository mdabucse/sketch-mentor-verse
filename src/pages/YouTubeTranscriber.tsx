import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Youtube, Download, FileText, MessageSquare, Send, Menu, X, User, Bot } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useActivityTracker } from '../hooks/useActivityTracker';

const YouTubeTranscriber = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Chat functionality states
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatName, setChatName] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'https://srt9mmrf-5000.inc1.devtunnels.ms';
  const chatEndRef = useRef(null);
  const { trackPageView, trackTranscription, trackChatInteraction, trackFeatureUsage } = useActivityTracker();

  useEffect(() => {
    // Track page view when component mounts
    trackPageView('YouTube Transcriber');
  }, []);

  useEffect(() => {
    if (!currentChat && chats.length === 0) {
      fetchChatNames();
    }
  }, [currentChat, chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatNames = async () => {
    try {
      const response = await axios.get(`${API_BASE}/chat_history`);
      const chatList = response.data.chat_names;
      setChats(chatList.map((chatTitle) => ({
        id: Date.now() + Math.random(),
        title: chatTitle,
        messages: []
      })));
    } catch (err) {
      console.error('Error fetching chat names:', err.message);
      setError('Failed to fetch chat names.');
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = inputText;
    setInputText('');

    try {
      let chat = currentChat;

      if (!chat) {
        const defaultChatName = `Chat ${chats.length + 1}`;
        const response = await axios.post(
          `${API_BASE}/chat_create`,
          { chat_name: defaultChatName },
          { headers: { 'Content-Type': 'application/json' } }
        );

        chat = { id: response.data.response, title: defaultChatName, messages: [] };
        setChats([...chats, chat]);
        setCurrentChat(chat);
      }

      const updatedMessages = [...(chat.messages || []), { text: userMessage, type: 'user' }];
      setMessages(updatedMessages);

      const chatResponse = await axios.post(
        `${API_BASE}/chat`,
        { chat_name: chat.title, message: userMessage },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botReply = { text: chatResponse.data.response, type: 'bot' };
      const finalMessages = [...updatedMessages, botReply];

      setMessages(finalMessages);
      setChats(chats.map((c) => (c.id === chat.id ? { ...c, messages: finalMessages } : c)));
      setCurrentChat({ ...chat, messages: finalMessages });

      // Track chat interaction
      await trackChatInteraction(chat.title, finalMessages.length);

    } catch (err) {
      console.error('Error in sending message:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to send message.');
    }
  };

  const selectChat = async (chat) => {
    setCurrentChat(chat);
    setChatName(chat.title);
    setError('');

    if (chat.messages.length > 0) {
      setMessages(chat.messages);
    } else {
      try {
        const response = await axios.post(`${API_BASE}/chat_resume`, {
          chat_name: chat.title
        });

        const fetchedMessages = [];

        for (let i = 0; i < response.data.response.length; i++) {
          const userMessage = response.data.response[i].human;
          const botMessage = response.data.response[i].AI;

          if (userMessage) {
            fetchedMessages.push({
              text: userMessage,
              type: 'user',
              timestamp: response.data.response[i].timestamp
            });
          }
          
          if (botMessage) {
            fetchedMessages.push({
              text: botMessage,
              type: 'bot',
              timestamp: response.data.response[i].timestamp
            });
          }
        }

        setMessages(fetchedMessages);

        const updatedChat = { ...chat, messages: fetchedMessages };
        setChats((prevChats) =>
          prevChats.map((prevChat) =>
            prevChat.id === chat.id ? updatedChat : prevChat
          )
        );
      } catch (err) {
        console.error('Error fetching chat messages:', err.message);
        setError('Failed to fetch chat messages.');
      }
    }
  };

  const handleTranscribe = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setIsTranscribing(true);
    setTranscription('');

    // Track transcription start
    await trackTranscription('started', youtubeUrl);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe video');
      }

      const data = await response.json();
      setTranscription(data.transcription);
      toast.success('Video transcribed successfully!');
      
      // Track successful transcription
      await trackTranscription('completed', youtubeUrl);
      await trackFeatureUsage('youtube_transcriber', 'transcription_completed', {
        video_url: youtubeUrl,
        transcription_length: data.transcription.length
      });

    } catch (error) {
      console.error('Error transcribing video:', error);
      toast.error('Failed to transcribe video. Please try again.');
      
      // Track failed transcription
      await trackTranscription('failed', youtubeUrl);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleDownload = async () => {
    if (transcription) {
      const blob = new Blob([transcription], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transcription.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Track download activity
      await trackFeatureUsage('youtube_transcriber', 'transcription_downloaded', {
        transcription_length: transcription.length
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex">
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
                Extract transcripts from YouTube videos and chat about the content with AI.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Input */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Video URL</CardTitle>
                  <CardDescription>
                    Enter the YouTube video URL you want to transcribe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <Button 
                      onClick={handleTranscribe} 
                      disabled={isTranscribing || !youtubeUrl.trim()}
                      className="w-full"
                    >
                      {isTranscribing ? (
                        <>
                          <FileText className="h-4 w-4 mr-2 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Transcribe Video
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Transcription Output */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Transcription</CardTitle>
                  <CardDescription>
                    The extracted text from the video will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isTranscribing ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Transcribing video...
                        </p>
                      </div>
                    </div>
                  ) : transcription ? (
                    <div className="space-y-4">
                      <Textarea
                        value={transcription}
                        readOnly
                        className="min-h-[200px]"
                      />
                      <Button variant="outline" className="w-full" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Transcription
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Enter a YouTube URL and click transcribe to get started
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Chat Sidebar */}
        <div className={`${showChatSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Chat</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowChatSidebar(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start space-x-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'bot' && <Bot className="h-6 w-6 mt-1 text-blue-600" />}
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.type === 'user' && <User className="h-6 w-6 mt-1 text-gray-600" />}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about the video..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!showChatSidebar && (
        <Button
          onClick={() => setShowChatSidebar(true)}
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default YouTubeTranscriber;
