
import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '', {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage'
});

// Utility functions for tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  mixpanel.track(eventName, properties);
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  mixpanel.identify(userId);
  if (properties) {
    mixpanel.people.set(properties);
  }
};

export default mixpanel;
