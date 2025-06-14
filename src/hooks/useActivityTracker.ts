
import { useAuth, trackUserActivity } from '../contexts/AuthContext';

export const useActivityTracker = () => {
  const { currentUser } = useAuth();

  const trackActivity = async (activity: string, details?: any) => {
    if (currentUser) {
      await trackUserActivity(currentUser.id, activity, details);
    }
  };

  const trackPageView = async (pageName: string) => {
    await trackActivity('page_view', { page: pageName });
  };

  const trackFeatureUsage = async (feature: string, action: string, data?: any) => {
    await trackActivity('feature_usage', { 
      feature, 
      action, 
      data,
      timestamp: new Date().toISOString()
    });
  };

  const trackVideoGeneration = async (status: 'started' | 'completed' | 'failed', details?: any) => {
    await trackActivity('video_generation', { status, ...details });
  };

  const trackTranscription = async (status: 'started' | 'completed' | 'failed', videoUrl?: string) => {
    await trackActivity('transcription', { status, video_url: videoUrl });
  };

  const trackChatInteraction = async (chatName: string, messageCount: number) => {
    await trackActivity('chat_interaction', { chat_name: chatName, message_count: messageCount });
  };

  return {
    trackActivity,
    trackPageView,
    trackFeatureUsage,
    trackVideoGeneration,
    trackTranscription,
    trackChatInteraction
  };
};
