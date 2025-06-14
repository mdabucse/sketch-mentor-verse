
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Play, Send, MessageCircle, User, Bot, Menu, X, Plus } from 'lucide-react';
import axios from 'axios';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const YouTubeTranscriber = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [transcription, setTranscription] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat management states
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chatName, setChatName] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = "https://srt9mmrf-5000.inc1.devtunnels.ms";
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentChat && chats.length === 0) {
      fetchChatNames();
      startNewChatWithDefaultName();
    }
  }, [currentChat, chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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

  // Chat management functions
  const fetchChatNames = async () => {
    try {
      const response = await axios.get(`${API_BASE}/chat_history`);
      const chatList = response.data.chat_names;
      setChats(chatList.map((chatTitle: string) => ({
        id: Date.now() + Math.random(),
        title: chatTitle,
        messages: []
      })));
    } catch (err) {
      console.error("Error fetching chat names:", err);
      setError("Failed to fetch chat names.");
    }
  };

  const startNewChatWithDefaultName = () => {
    const defaultChatName = `Video Chat ${chats.length + 1}`;
    const newChat: Chat = { 
      id: Date.now().toString(), 
      title: defaultChatName, 
      messages: [] 
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    setChatMessages([]);
  };

  const selectChat = async (chat: Chat) => {
    setCurrentChat(chat);
    setChatName(chat.title);
    setError("");

    if (chat.messages.length > 0) {
      setChatMessages(chat.messages);
    } else {
      try {
        const response = await axios.post(`${API_BASE}/chat_resume`, {
          chat_name: chat.title
        });

        const fetchedMessages: ChatMessage[] = [];
        
        for (let i = 0; i < response.data.response.length; i++) {
          const userMessage = response.data.response[i].human;
          const botMessage = response.data.response[i].AI;

          if (userMessage) {
            fetchedMessages.push({
              id: `user-${i}`,
              type: "user",
              content: userMessage,
              timestamp: new Date(response.data.response[i].timestamp)
            });
          }
          
          if (botMessage) {
            fetchedMessages.push({
              id: `bot-${i}`,
              type: "bot", 
              content: botMessage,
              timestamp: new Date(response.data.response[i].timestamp)
            });
          }
        }

        setChatMessages(fetchedMessages);
        
        const updatedChat = { ...chat, messages: fetchedMessages };
        setChats((prevChats) =>
          prevChats.map((prevChat) =>
            prevChat.id === chat.id ? updatedChat : prevChat
          )
        );
      } catch (err) {
        console.error("Error fetching chat messages:", err);
        setError("Failed to fetch chat messages.");
      }
    }
  };

  const startNewChat = async () => {
    if (chatName.trim() === "") {
      setError("Chat name cannot be empty.");
      return;
    }

    if (chats.some((chat) => chat.title === chatName)) {
      setError("Chat name already exists.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/chat_create`,
        { chat_name: chatName },
        { headers: { "Content-Type": "application/json" } }
      );

      const newChat: Chat = { 
        id: response.data.response, 
        title: chatName, 
        messages: [] 
      };
      setChats([...chats, newChat]);
      setCurrentChat(newChat);
      setChatMessages([]);
      setChatName("");
      setError("");
      setShowSidebar(false);
    } catch (err: any) {
      console.error("Error creating chat:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to create chat.");
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setInputText("");

    try {
      let chat = currentChat;

      if (!chat) {
        const defaultChatName = `Video Chat ${chats.length + 1}`;
        const response = await axios.post(
          `${API_BASE}/chat_create`,
          { chat_name: defaultChatName },
          { headers: { "Content-Type": "application/json" } }
        );

        chat = { 
          id: response.data.response, 
          title: defaultChatName, 
          messages: [] 
        };
        setChats([...chats, chat]);
        setCurrentChat(chat);
      }

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      };

      const updatedMessages = [...(chat.messages || []), userMsg];
      setChatMessages(updatedMessages);

      // Add transcription context to the message
      const contextualMessage = transcription 
        ? `Based on this video transcription: "${transcription.substring(0, 500)}..." \n\nUser question: ${userMessage}`
        : userMessage;

      const chatResponse = await axios.post(
        `${API_BASE}/chat`,
        { chat_name: chat.title, message: contextualMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: chatResponse.data.response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, botMsg];
      setChatMessages(finalMessages);
      setChats(chats.map((c) => (c.id === chat.id ? { ...c, messages: finalMessages } : c)));
      setCurrentChat({ ...chat, messages: finalMessages });

    } catch (err: any) {
      console.error("Error in sending message:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to send message.");
    }

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

            {/* Right Column - Enhanced Chat Bot */}
            <Card className="flex flex-col relative">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </CardHeader>

              {/* Chat Sidebar */}
              {showSidebar && (
                <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800 z-10 p-4 border-r">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Chat History</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSidebar(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Enter chat name..."
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        className="mb-2"
                      />
                      <Button onClick={startNewChat} className="w-full" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Chat
                      </Button>
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className={`p-2 rounded cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              currentChat?.id === chat.id ? 'bg-purple-100 dark:bg-purple-900/20' : ''
                            }`}
                            onClick={() => {
                              selectChat(chat);
                              setShowSidebar(false);
                            }}
                          >
                            {chat.title}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

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
                          className={`flex items-start gap-2 ${
                            message.type === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.type === 'bot' && (
                            <Bot className="h-6 w-6 text-purple-600 mt-1" />
                          )}
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              message.type === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {message.content}
                          </div>
                          {message.type === 'user' && (
                            <User className="h-6 w-6 text-blue-600 mt-1" />
                          )}
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
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
                    disabled={!transcription && !currentChat}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
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
