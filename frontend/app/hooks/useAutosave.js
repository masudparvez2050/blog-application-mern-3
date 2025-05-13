import { useState, useCallback } from 'react';

export const useAutosave = (saveCallback, delay = 3000) => {
  const [autosaveTimeout, setAutosaveTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  const handleAutosave = useCallback(async () => {
    try {
      setIsSaving(true);
      await saveCallback();
      setLastSaved(new Date());
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to autosave');
      console.error('Autosave failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [saveCallback]);

  const queueAutosave = useCallback(() => {
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }

    const timeoutId = setTimeout(() => {
      handleAutosave();
    }, delay);

    setAutosaveTimeout(timeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [autosaveTimeout, delay, handleAutosave]);

  const cancelAutosave = useCallback(() => {
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
      setAutosaveTimeout(null);
    }
  }, [autosaveTimeout]);

  return {
    queueAutosave,
    cancelAutosave,
    isSaving,
    lastSaved,
    error,
    clearError: () => setError(null)
  };
};
