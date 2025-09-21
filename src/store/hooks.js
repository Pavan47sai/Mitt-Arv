import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  addNotification as addNotificationAction, 
  removeNotification as removeNotificationAction, 
  clearNotifications as clearNotificationsAction, 
  openModal as openModalAction, 
  closeModal as closeModalAction, 
  closeAllModals as closeAllModalsAction 
} from './slices/uiSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hook for notifications
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  const addNotification = useCallback(
    (notification) => {
      dispatch(addNotificationAction(notification));
    },
    [dispatch]
  );

  const removeNotification = useCallback(
    (id) => {
      dispatch(removeNotificationAction(id));
    },
    [dispatch]
  );

  const clearNotifications = useCallback(() => {
    dispatch(clearNotificationsAction());
  }, [dispatch]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};

// Custom hook for modals
export const useModals = () => {
  const dispatch = useAppDispatch();
  const modals = useAppSelector((state) => state.ui.modals);

  const openModal = useCallback(
    (modalName) => {
      dispatch(openModalAction(modalName));
    },
    [dispatch]
  );

  const closeModal = useCallback(
    (modalName) => {
      dispatch(closeModalAction(modalName));
    },
    [dispatch]
  );

  const closeAllModals = useCallback(() => {
    dispatch(closeAllModalsAction());
  }, [dispatch]);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
};
