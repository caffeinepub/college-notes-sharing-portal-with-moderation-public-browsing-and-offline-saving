import { useNavigate } from '@tanstack/react-router';
import { useGetMySubmissions } from '../../hooks/useQueries';
import AuthGate from '../../components/auth/AuthGate';
import ModeratorGate from '../../components/auth/ModeratorGate';
import PageLayout from '../../components/layout/PageLayout';
import EmptyState from '../../components/empty-states/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Note } from '../../backend';

export default function ModeratorQueuePage() {
  const { data: allNotes, isLoading } = useGetMySubmissions();
  const navigate = useNavigate();

  const pendingNotes = allNotes?.filter((note) => !note.verified && !note.rejectionReason) || [];

  return (
    <AuthGate>
      <ModeratorGate>
        <PageLayout
          title="Moderator Queue"
          description="Review and moderate pending note submissions"
          maxWidth="lg"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : pendingNotes.length > 0 ? (
            <div className="space-y-4">
              {pendingNotes.map((note, index) => {
                const createdDate = new Date(Number(note.createdTimestamp) / 1_000_000);
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{note.title}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline">{note.subject}</Badge>
                            <Badge variant="outline">Unit {note.unit}</Badge>
                            <span className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(createdDate, { addSuffix: true })}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">Pending Review</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{note.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{note.uploader.toString().slice(0, 12)}...</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate({ to: '/moderator/review/$noteId', params: { noteId: index.toString() } })}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No pending submissions"
              description="All notes have been reviewed. Check back later for new submissions."
              showIllustration={false}
            />
          )}
        </PageLayout>
      </ModeratorGate>
    </AuthGate>
  );
}
