import { useNavigate } from '@tanstack/react-router';
import { useGetMySubmissions } from '../hooks/useQueries';
import AuthGate from '../components/auth/AuthGate';
import PageLayout from '../components/layout/PageLayout';
import NoteCard from '../components/notes/NoteCard';
import EmptyState from '../components/empty-states/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';

export default function MySubmissionsPage() {
  const { data: notes, isLoading } = useGetMySubmissions();
  const navigate = useNavigate();

  return (
    <AuthGate>
      <PageLayout title="My Submissions" description="Track the status of your submitted notes">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <NoteCard key={index} note={note} noteId={index.toString()} showStatus />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No submissions yet"
            description="You haven't submitted any notes yet. Share your knowledge with the community!"
            action={
              <Button onClick={() => navigate({ to: '/submit' })}>
                <Upload className="h-4 w-4 mr-2" />
                Submit Your First Note
              </Button>
            }
          />
        )}
      </PageLayout>
    </AuthGate>
  );
}
