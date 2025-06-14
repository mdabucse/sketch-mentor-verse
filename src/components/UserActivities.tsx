
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserActivities } from '@/hooks/useUserActivities';
import { Clock, Video, BarChart, FileText, Image, Youtube, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'video_generated':
      return Video;
    case 'graph_visualized':
      return BarChart;
    case 'document_analyzed':
      return FileText;
    case 'canvas_used':
      return Image;
    case 'youtube_transcribed':
      return Youtube;
    case 'login':
      return User;
    default:
      return Clock;
  }
};

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case 'video_generated':
      return 'text-red-600';
    case 'graph_visualized':
      return 'text-blue-600';
    case 'document_analyzed':
      return 'text-green-600';
    case 'canvas_used':
      return 'text-purple-600';
    case 'youtube_transcribed':
      return 'text-orange-600';
    case 'login':
      return 'text-gray-600';
    default:
      return 'text-gray-500';
  }
};

const formatActivityTitle = (activityType: string, details: any) => {
  switch (activityType) {
    case 'video_generated':
      return details?.title || 'Video Generated';
    case 'graph_visualized':
      return details?.function || 'Graph Visualized';
    case 'document_analyzed':
      return details?.filename || 'Document Analyzed';
    case 'canvas_used':
      return 'Canvas AI Used';
    case 'youtube_transcribed':
      return details?.title || 'YouTube Video Transcribed';
    case 'login':
      return 'Logged In';
    default:
      return 'Activity';
  }
};

export const UserActivities = () => {
  const { activities, loading } = useUserActivities();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">No activities yet. Start using the tools to see your activity history!</p>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.activity_type);
              const colorClass = getActivityColor(activity.activity_type);
              const title = formatActivityTitle(activity.activity_type, activity.details);
              
              return (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${colorClass}`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
