
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserActivity {
  id: string;
  activity_type: string;
  details: any;
  timestamp: string;
}

export const useUserActivities = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch user activities
  const fetchActivities = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track a new activity
  const trackActivity = async (activityType: string, details: any = {}) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: currentUser.uid,
          activity_type: activityType,
          details: details
        });

      if (error) throw error;
      
      // Refresh activities after tracking
      fetchActivities();
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [currentUser]);

  return {
    activities,
    loading,
    trackActivity,
    refetchActivities: fetchActivities
  };
};
