import { toast } from 'sonner';
import useUiStore from '@/store/uiStore';

const RESUME_KEY = 'auth_resume_path';

export function requireLogin({ resumePath = null, message = 'Please log in to proceed' } = {}) {
  if (resumePath) {
    try {
      sessionStorage.setItem(RESUME_KEY, resumePath);
    } catch (err) {
      console.warn('Could not store auth resume path:', err);
    }
  }
  toast.error(message, { id: 'auth-toast' });
  useUiStore.getState().openLoginModal();
}

export function consumeResumePath() {
  let path = null;
  try {
    path = sessionStorage.getItem(RESUME_KEY);
    sessionStorage.removeItem(RESUME_KEY);
  } catch (err) {
    console.warn('Could not read auth resume path:', err);
  }
  return path;
}