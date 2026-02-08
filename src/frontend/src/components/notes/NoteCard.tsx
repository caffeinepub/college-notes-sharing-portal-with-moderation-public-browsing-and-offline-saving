import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Note } from '../../backend';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Calendar } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  noteId: string;
  showStatus?: boolean;
}

export default function NoteCard({ note, noteId, showStatus = false }: NoteCardProps) {
  const createdDate = new Date(Number(note.createdTimestamp) / 1_000_000);

  return (
    <Link to="/note/$noteId" params={{ noteId }} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2">{note.title}</CardTitle>
            {showStatus && (
              <Badge variant={note.verified ? 'default' : note.rejectionReason ? 'destructive' : 'secondary'}>
                {note.verified ? 'Verified' : note.rejectionReason ? 'Rejected' : 'Pending'}
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-4 text-sm">
            <span className="font-medium">{note.subject}</span>
            <span className="text-muted-foreground">Unit {note.unit}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{note.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
            </div>
            {note.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{note.attachments.length} attachment{note.attachments.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
