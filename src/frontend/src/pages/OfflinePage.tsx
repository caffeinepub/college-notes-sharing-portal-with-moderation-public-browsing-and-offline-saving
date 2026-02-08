import { useNavigate } from '@tanstack/react-router';
import { useOfflineSavedNotes } from '../hooks/useOfflineSavedNotes';
import AuthGate from '../components/auth/AuthGate';
import PageLayout from '../components/layout/PageLayout';
import NoteCard from '../components/notes/NoteCard';
import EmptyState from '../components/empty-states/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';

export default function OfflinePage() {
  const { savedNotes, isLoading } = useOfflineSavedNotes();
  const navigate = useNavigate();

  return (
    <AuthGate>
      <PageLayout title="Offline Notes" description="Access your saved notes even when offline">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : savedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedNotes.map((savedNote) => (
              <NoteCard key={savedNote.id} note={savedNote.note} noteId={savedNote.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No offline notes saved"
            description="Save notes for offline access to view them even without an internet connection"
            action={
              <Button onClick={() => navigate({ to: '/' })}>
                <Download className="h-4 w-4 mr-2" />
                Browse Notes to Save
              </Button>
            }
          />
        )}
      </PageLayout>
    </AuthGate>
  );
}
