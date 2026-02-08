import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetVerifiedNotes } from '../hooks/useQueries';
import PageLayout from '../components/layout/PageLayout';
import NoteCard from '../components/notes/NoteCard';
import EmptyState from '../components/empty-states/EmptyState';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, X } from 'lucide-react';

export default function PublicBrowsePage() {
  const { data: notes, isLoading } = useGetVerifiedNotes();
  const navigate = useNavigate();
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');

  const subjects = useMemo(() => {
    if (!notes) return [];
    const uniqueSubjects = Array.from(new Set(notes.map((n) => n.subject)));
    return uniqueSubjects.sort();
  }, [notes]);

  const units = useMemo(() => {
    if (!notes) return [];
    const uniqueUnits = Array.from(new Set(notes.map((n) => n.unit)));
    return uniqueUnits.sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    return notes.filter((note) => {
      const matchesSubject = subjectFilter === 'all' || note.subject === subjectFilter;
      const matchesUnit = unitFilter === 'all' || note.unit === unitFilter;
      return matchesSubject && matchesUnit;
    });
  }, [notes, subjectFilter, unitFilter]);

  const hasActiveFilters = subjectFilter !== 'all' || unitFilter !== 'all';

  const clearFilters = () => {
    setSubjectFilter('all');
    setUnitFilter('all');
  };

  if (isLoading) {
    return (
      <PageLayout title="Browse Notes" description="Explore verified notes shared by students">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Browse Notes" description="Explore verified notes shared by students">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={unitFilter} onValueChange={setUnitFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                Unit {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No notes match your filters' : 'No notes available yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your filters to see more results'
              : 'Be the first to share your notes with the community!'
          }
          action={
            hasActiveFilters ? (
              <Button onClick={clearFilters}>Clear Filters</Button>
            ) : (
              <Button onClick={() => navigate({ to: '/submit' })}>Submit a Note</Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <NoteCard key={index} note={note} noteId={index.toString()} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
