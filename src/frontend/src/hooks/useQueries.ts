import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note, NoteId, AttachmentMetadata, UserProfile } from '../backend';

export function useGetVerifiedNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['verifiedNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVerifiedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMySubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['mySubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNoteById(noteId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Note | null>({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!actor || !noteId) return null;
      try {
        return await actor.getNoteById(BigInt(noteId));
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!noteId,
    retry: false,
  });
}

export function useSubmitNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subject,
      unit,
      title,
      description,
      attachments,
    }: {
      subject: string;
      unit: string;
      title: string;
      description: string;
      attachments: AttachmentMetadata[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitNote(subject, unit, title, description, attachments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
