import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface NotificationContextType {
  showBrowserNotification: (title: string, options?: NotificationOptions) => void;
  permission: NotificationPermission;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');

const requestPermission = async (): Promise<void> => {
    if (!('Notification' in window)) {
      toast({ title: 'Browser notifications not supported', variant: 'destructive' });
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        toast({ title: 'Browser notifications enabled!' });
      } else {
        toast({ title: 'Notifications blocked. Using alerts as fallback.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Permission request failed', description: err instanceof Error ? err.message : undefined, variant: 'destructive' });
    }
  };

  const showBrowserNotification = (title: string, options: NotificationOptions = {}) => {
    if (!('Notification' in window)) {
      alert(title); // Simple fallback
      return;
    }
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        body: options.body || 'Todo App Update',
        requireInteraction: false,
        silent: false,
        ...options,
      });
    } else if (permission === 'denied') {
      alert(title);
    } else {
      // default: show anyway but request
      requestPermission();
      alert(`Grant permission for browser notifications: ${title}`);
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ showBrowserNotification, permission, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

