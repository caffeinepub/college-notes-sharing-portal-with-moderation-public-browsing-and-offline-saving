import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetNoteById } from '../../hooks/useQueries';
import { useVerifyNote } from '../../hooks/useModeration';
import AuthGate from '../../components/auth/AuthGate';
import ModeratorGate from '../../components/auth/ModeratorGate';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle, XCircle, Calendar, User, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function ModeratorReviewPage() {
  const { noteId } = useParams({ from: '/moderator/review/$noteId' });
  const navigate = useNavigate();
  const { data: note, isLoading } = useGetNoteById(noteId);
  const verifyNote = useVerifyNote();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleVerify = async () => {
    try {
      await verifyNote.mutateAsync({ noteId: BigInt(noteId), rejectReason: null });
      toast.success('Note verified successfully!');
      navigate({ to: '/moderator' });
    } catch (error) {
      toast.error('Failed to verify note');
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await verifyNote.mutateAsync({ noteId: BigInt(noteId), rejectReason: rejectionReason.trim() });
      toast.success('Note rejected');
      navigate({ to: '/moderator' });
    } catch (error) {
      toast.error('Failed to reject note');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <AuthGate>
        <ModeratorGate>
          <PageLayout>
            <Skeleton className="h-96 w-full" />
          </PageLayout>
        </ModeratorGate>
      </AuthGate>
    );
  }

  if (!note) {
    return (
      <AuthGate>
        <ModeratorGate>
          <PageLayout>
            <p className="text-center text-muted-foreground">Note not found</p>
            <Button onClick={() => navigate({ to: '/moderator' })} className="mt-4">
              Back to Queue
            </Button>
          </PageLayout>
        </ModeratorGate>
      </AuthGate>
    );
  }

  const createdDate = new Date(Number(note.createdTimestamp) / 1_000_000);

  return (
    <AuthGate>
      <ModeratorGate>
        <PageLayout maxWidth="lg">
          <Button variant="ghost" onClick={() => navigate({ to: '/moderator' })} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queue
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-2">
                <CardTitle className="text-3xl">{note.title}</CardTitle>
                <Badge variant="secondary">Pending Review</Badge>
              </div>
              <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                <Badge variant="outline" className="font-semibold">
                  {note.subject}
                </Badge>
                <Badge variant="outline">Unit {note.unit}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{note.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Uploader: {note.uploader.toString().slice(0, 12)}...</span>
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

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Moderation Actions</h3>

                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <Button onClick={handleVerify} disabled={verifyNote.isPending}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {verifyNote.isPending ? 'Verifying...' : 'Verify Note'}
                    </Button>
                    <Button variant="destructive" onClick={() => setShowRejectForm(true)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Note
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason">Rejection Reason</Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this note is being rejected..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="destructive" onClick={handleReject} disabled={verifyNote.isPending}>
                        {verifyNote.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </PageLayout>
      </ModeratorGate>
    </AuthGate>
  );
}
