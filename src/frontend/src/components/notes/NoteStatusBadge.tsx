import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface NoteStatusBadgeProps {
  verified: boolean;
  rejectionReason?: string;
}

export default function NoteStatusBadge({ verified, rejectionReason }: NoteStatusBadgeProps) {
  if (verified) {
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Verified
      </Badge>
    );
  }

  if (rejectionReason) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  );
}
