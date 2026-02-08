import { useState, useEffect, useCallback } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import type { Note } from '../backend';

interface SavedNote {
  id: string;
  note: Note;
  savedAt: number;
}

const STORAGE_KEY = 'offline_saved_notes';

export function useOfflineSavedNotes() {
  const { identity } = useInternetIdentity();
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!identity;

  const loadSavedNotes = useCallback(() => {
    if (!isAuthenticated) {
      setSavedNotes([]);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedNote[];
        setSavedNotes(parsed);
      } else {
        setSavedNotes([]);
      }
    } catch (error) {
      console.error('Error loading saved notes:', error);
      setSavedNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSavedNotes();
  }, [loadSavedNotes]);

  const saveNote = useCallback(
    (noteId: string, note: Note) => {
      if (!isAuthenticated) {
        throw new Error('Must be authenticated to save notes offline');
      }

      const newSavedNote: SavedNote = {
        id: noteId,
        note,
        savedAt: Date.now(),
      };

      const updated = [...savedNotes.filter((n) => n.id !== noteId), newSavedNote];
      setSavedNotes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [isAuthenticated, savedNotes]
  );

  const removeNote = useCallback(
    (noteId: string) => {
      if (!isAuthenticated) {
        throw new Error('Must be authenticated to remove saved notes');
      }

      const updated = savedNotes.filter((n) => n.id !== noteId);
      setSavedNotes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [isAuthenticated, savedNotes]
  );

  const isNoteSaved = useCallback(
    (noteId: string) => {
      return savedNotes.some((n) => n.id === noteId);
    },
    [savedNotes]
  );

  const getSavedNote = useCallback(
    (noteId: string) => {
      return savedNotes.find((n) => n.id === noteId);
    },
    [savedNotes]
  );

  return {
    savedNotes,
    isLoading,
    saveNote,
    removeNote,
    isNoteSaved,
    getSavedNote,
  };
}
