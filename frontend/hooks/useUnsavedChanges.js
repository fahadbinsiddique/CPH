// Guards against losing unsaved work. Blocks browser refresh/close via
// `beforeunload`, intercepts in-app `<a>` navigation and the browser
// back/forward buttons, and surfaces a custom confirmation dialog.

import { useState, useEffect, useRef, useCallback } from 'react';
import UnsavedChangesDialog from '@/components/blog/UnsavedChangesDialog';

const isInternalHref = (href) => {
  if (!href) return false;
  if (href.startsWith('http') || href.startsWith('//')) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return false;
  return true;
};

export default function useUnsavedChanges({ message } = {}) {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const dirtyRef = useRef(false);

  const setDirty = useCallback((value) => {
    dirtyRef.current = Boolean(value);
    setIsDirty(Boolean(value));
  }, []);

  // Programmatic navigation (back buttons, post-save redirects) must be
  // routed through this so the guard can veto it when the form is dirty.
  const confirmLeave = useCallback((action) => {
    if (typeof action !== 'function') return;
    if (!dirtyRef.current) {
      action();
      return;
    }
    setPendingAction(() => action);
  }, []);

  const cancelLeave = useCallback(() => setPendingAction(null), []);

  const approveLeave = useCallback(() => {
    const action = pendingAction;
    setPendingAction(null);
    setDirty(false);
    if (typeof action === 'function') action();
  }, [pendingAction, setDirty]);

  useEffect(() => {
    if (!isDirty) return undefined;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleDocumentClick = (e) => {
      if (!e.target || !e.target.closest) return;
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!isInternalHref(href)) return;
      const targetPath = (href.split('#')[0] || '/');
      if (targetPath === window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingAction(() => () => {
        window.location.assign(targetPath);
      });
    };

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      setPendingAction(() => () => window.history.back());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDirty]);

  const dialog = pendingAction ? (
    <UnsavedChangesDialog
      message={message}
      onCancel={cancelLeave}
      onConfirm={approveLeave}
    />
  ) : null;

  return { isDirty, setDirty, confirmLeave, dialog };
}
