import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSubmitNote } from '../hooks/useQueries';
import AuthGate from '../components/auth/AuthGate';
import PageLayout from '../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Plus, X } from 'lucide-react';
import type { AttachmentMetadata } from '../backend';

export default function SubmitNotePage() {
  const navigate = useNavigate();
  const submitNote = useSubmitNote();

  const [subject, setSubject] = useState('');
  const [unit, setUnit] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<AttachmentMetadata[]>([]);
  const [newAttachment, setNewAttachment] = useState({ filename: '', fileType: '', fileSize: '' });

  const handleAddAttachment = () => {
    if (!newAttachment.filename || !newAttachment.fileType || !newAttachment.fileSize) {
      toast.error('Please fill in all attachment fields');
      return;
    }

    const fileSize = parseInt(newAttachment.fileSize);
    if (isNaN(fileSize) || fileSize <= 0) {
      toast.error('Please enter a valid file size');
      return;
    }

    setAttachments([
      ...attachments,
      {
        filename: newAttachment.filename,
        fileType: newAttachment.fileType,
        fileSize: BigInt(fileSize),
      },
    ]);
    setNewAttachment({ filename: '', fileType: '', fileSize: '' });
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !unit.trim() || !title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await submitNote.mutateAsync({
        subject: subject.trim(),
        unit: unit.trim(),
        title: title.trim(),
        description: description.trim(),
        attachments,
      });
      toast.success('Note submitted successfully! It will be reviewed by moderators.');
      navigate({ to: '/my-submissions' });
    } catch (error) {
      toast.error('Failed to submit note');
      console.error(error);
    }
  };

  return (
    <AuthGate>
      <PageLayout title="Submit a Note" description="Share your notes with the community">
        <Card>
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
            <CardDescription>Fill in the information below to submit your note for review</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Physics"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">
                    Unit <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., 1, 2, 3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for your notes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the notes content"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Attachments (Optional)</Label>
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium text-sm">{attachment.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {attachment.fileType} • {(Number(attachment.fileSize) / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <Input
                        placeholder="Filename"
                        value={newAttachment.filename}
                        onChange={(e) => setNewAttachment({ ...newAttachment, filename: e.target.value })}
                      />
                      <Input
                        placeholder="File type (e.g., PDF)"
                        value={newAttachment.fileType}
                        onChange={(e) => setNewAttachment({ ...newAttachment, fileType: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Size (bytes)"
                        value={newAttachment.fileSize}
                        onChange={(e) => setNewAttachment({ ...newAttachment, fileSize: e.target.value })}
                      />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddAttachment}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attachment
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitNote.isPending}>
                  <Upload className="h-4 w-4 mr-2" />
                  {submitNote.isPending ? 'Submitting...' : 'Submit Note'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate({ to: '/' })}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageLayout>
    </AuthGate>
  );
}
