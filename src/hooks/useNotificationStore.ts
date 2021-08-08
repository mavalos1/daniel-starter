import compose from "@/lib/compose";
import { nanoid } from "nanoid";

export enum NOTIFICATION_TYPES {
  info,
  warning,
  success,
  error,
}

export type Notification = {
  id: string;
  type: keyof typeof NOTIFICATION_TYPES;
  title: string;
  message?: string;
};

type NotificationsState = {
  notifications: Notification[];
  pushNotification: (notification: Omit<Notification, "id">) => void;
  dismissNotification: (id: string) => void;
};

const useNotificationStore = compose<NotificationsState>((set) => ({
  notifications: [],
  pushNotification: (notification) =>
    set(({ notifications }) => ({
      notifications: [...notifications, { id: nanoid(), ...notification }],
    })),
  dismissNotification: (id) =>
    set(({ notifications }) => ({
      notifications: notifications.filter((noti) => noti.id !== id),
    })),
}));

export default useNotificationStore;
