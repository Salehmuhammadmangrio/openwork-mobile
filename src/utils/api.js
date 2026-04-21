import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../navigation/navigationRef';
import { showToast } from './toast';

export const API_BASE_URL = 'http://134.209.150.239:5000/api';
export const SERVER_URL = 'http://134.209.150.239:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

let isRedirecting = false;

const handleSessionExpiration = async () => {
  if (isRedirecting) return;
  isRedirecting = true;
  try {
    delete api.defaults.headers.common.Authorization;
    await AsyncStorage.multiRemove(['ow-token', 'ow-auth', 'ow-user']);
    showToast({ type: 'error', message: 'Session expired. Please log in again.' });
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] })
        );
      }
      isRedirecting = false;
    }, 400);
  } catch {
    isRedirecting = false;
  }
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('ow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const skipAuthRedirect = Boolean(err.config?.meta?.skipAuthRedirect);
    const hadToken = Boolean(err.config?.headers?.Authorization);
    const status = err.response?.status;

    if ((status === 401 || status === 403) && !skipAuthRedirect && hadToken) {
      handleSessionExpiration();
    } else if (status >= 500) {
      showToast({ type: 'error', message: 'Server error. Please try again.' });
    }

    return Promise.reject(err);
  }
);

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
