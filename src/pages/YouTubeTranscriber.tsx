import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Youtube, Download, MessageCircle, Loader } from 'lucide-react';
import { useUserActivities } from '@/hooks/useUserActivities';

const YouTubeTranscriber = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { trackActivity } = useUserActivities();

  // Track page access when component mounts
  useEffect(() => {
    trackActivity('page_visited', { 
      page: 'YouTube Transcriber',
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  const transcribeVideo = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsTranscribing(true);
    console.log('Transcribing YouTube video:', youtubeUrl);
    
    // Track YouTube transcription activity
    trackActivity('youtube_transcribed', { 
      url: youtubeUrl,
      timestamp: new Date().toISOString()
    });
    
    // Simulate transcription process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setTranscript('Sample transcript would appear here...');
    setIsTranscribing(false);
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

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Youtube className="h-5 w-5 mr-2 text-red-600" />
                Transcription Settings
              </CardTitle>
              <CardDescription>
                Enter the YouTube video URL to transcribe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube Video URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={transcribeVideo}
                disabled={isTranscribing}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTranscribing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Youtube className="h-4 w-4 mr-2" />
                    Transcribe Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {transcript && (
            <Card className="mt-8 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Transcription
                </CardTitle>
                <CardDescription>
                  Here is the transcribed text from the YouTube video.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line">
                  {transcript}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default YouTubeTranscriber;
