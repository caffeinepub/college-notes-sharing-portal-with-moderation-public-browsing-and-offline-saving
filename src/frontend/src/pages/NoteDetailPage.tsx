import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetNoteById } from '../hooks/useQueries';
import { useOfflineSavedNotes } from '../hooks/useOfflineSavedNotes';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PageLayout from '../components/layout/PageLayout';
import NoteStatusBadge from '../components/notes/NoteStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, FileText, Download, Trash2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function NoteDetailPage() {
  const { noteId } = useParams({ from: '/note/$noteId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: note, isLoading, error } = useGetNoteById(noteId);
  const { isNoteSaved, saveNote, removeNote } = useOfflineSavedNotes();

  const isAuthenticated = !!identity;
  const isSaved = note ? isNoteSaved(noteId) : false;

  const handleSaveOffline = () => {
    if (!note) return;
    try {
      saveNote(noteId, note);
      toast.success('Note saved for offline access');
    } catch (error) {
      toast.error('Failed to save note offline');
    }
  };

  const handleRemoveOffline = () => {
    try {
      removeNote(noteId);
      toast.success('Note removed from offline storage');
    } catch (error) {
      toast.error('Failed to remove note');
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Skeleton className="h-96 w-full" />
      </PageLayout>
    );
  }

  if (error || !note) {
    return (
      <PageLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? 'You do not have permission to view this note.' : 'Note not found.'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>
      </PageLayout>
    );
  }

  const createdDate = new Date(Number(note.createdTimestamp) / 1_000_000);
  const updatedDate = new Date(Number(note.lastUpdatedTimestamp) / 1_000_000);

  return (
    <PageLayout maxWidth="lg">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-2">
            <CardTitle className="text-3xl">{note.title}</CardTitle>
            <NoteStatusBadge verified={note.verified} rejectionReason={note.rejectionReason} />
          </div>
          <CardDescription className="flex flex-wrap items-center gap-4 text-base">
            <Badge variant="outline" className="font-semibold">
              {note.subject}
            </Badge>
            <Badge variant="outline">Unit {note.unit}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {note.rejectionReason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Rejection Reason:</strong> {note.rejectionReason}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{note.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Uploader: {note.uploader.toString().slice(0, 8)}...</span>
            </div>
          </div>

          {note.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attachments ({note.attachments.length})
                </h3>
                <div className="space-y-2">
                  {note.attachments.map((attachment, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{attachment.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {attachment.fileType} • {(Number(attachment.fileSize) / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {isAuthenticated && note.verified && (
            <>
              <Separator />
              <div className="flex gap-3">
                {isSaved ? (
                  <Button variant="outline" onClick={handleRemoveOffline}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove from Offline
                  </Button>
                ) : (
                  <Button onClick={handleSaveOffline}>
                    <Download className="h-4 w-4 mr-2" />
                    Save for Offline
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
