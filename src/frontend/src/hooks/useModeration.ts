import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note, NoteId } from '../backend';

export function useGetPendingNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['pendingNotes'],
    queryFn: async () => {
      if (!actor) return [];
      const submissions = await actor.getMySubmissions();
      return submissions.filter((note) => !note.verified && !note.rejectionReason);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVerifyNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, rejectReason }: { noteId: NoteId; rejectReason: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyNote(noteId, rejectReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifiedNotes'] });
      queryClient.invalidateQueries({ queryKey: ['pendingNotes'] });
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['note'] });
    },
  });
}
