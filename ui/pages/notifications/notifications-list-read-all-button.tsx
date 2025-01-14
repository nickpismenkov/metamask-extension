import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type {
  Notification,
  MarkAsReadNotificationsParam,
} from '../../../app/scripts/controllers/metamask-notifications/types/notification/notification';
import { useI18nContext } from '../../hooks/useI18nContext';
import { useMarkNotificationAsRead } from '../../hooks/metamask-notifications/useNotifications';
import { getUnreadNotifications } from '../../selectors';
import { markNotificationsAsRead } from '../../store/actions';
import { Box, Button, ButtonVariant } from '../../components/component-library';
import { BlockSize } from '../../helpers/constants/design-system';
import type { NotificationType } from './notifications';

export type NotificationsListReadAllButtonProps = {
  notifications: NotificationType[];
};

export const NotificationsListReadAllButton = ({
  notifications,
}: NotificationsListReadAllButtonProps) => {
  const dispatch = useDispatch();
  const t = useI18nContext();
  const { markNotificationAsRead } = useMarkNotificationAsRead();

  const unreadNotifications = useSelector(getUnreadNotifications);

  const [notificationReadArray, setNotificationReadArray] =
    useState<MarkAsReadNotificationsParam>([]);

  useEffect(() => {
    let notificationsRead: MarkAsReadNotificationsParam = [];

    if (notifications && notifications.length > 0) {
      notificationsRead = notifications
        .filter(
          (notification): notification is Notification =>
            (notification as Notification).id !== undefined,
        )
        .map((notification: Notification) => ({
          id: notification.id,
          type: notification.type,
          isRead: notification.isRead,
        }));
    }
    setNotificationReadArray(notificationsRead);
  }, [notifications]);

  const handleOnClick = () => {
    // Mark all metamask notifications as read
    markNotificationAsRead(notificationReadArray);

    // Mark all snap notifications as read
    const unreadNotificationIds = unreadNotifications.map(({ id }) => id);
    dispatch(markNotificationsAsRead(unreadNotificationIds));
  };

  return (
    <Box
      paddingLeft={4}
      paddingRight={4}
      paddingTop={4}
      className="notifications__list__read__all__button"
    >
      <Button
        onClick={handleOnClick}
        variant={ButtonVariant.Primary}
        width={BlockSize.Full}
        data-testid="notifications-list-read-all-button"
      >
        {t('notificationsMarkAllAsRead')}
      </Button>
    </Box>
  );
};
