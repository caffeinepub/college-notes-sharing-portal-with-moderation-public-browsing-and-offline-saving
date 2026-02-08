import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useCallerRole';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Upload, Shield, Download, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from '../auth/LoginButton';

export default function AppHeader() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        to="/"
        className="text-foreground/80 hover:text-foreground transition-colors font-medium"
        activeProps={{ className: 'text-primary font-semibold' }}
      >
        Browse Notes
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/submit"
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            activeProps={{ className: 'text-primary font-semibold' }}
          >
            Submit Note
          </Link>
          <Link
            to="/my-submissions"
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            activeProps={{ className: 'text-primary font-semibold' }}
          >
            My Submissions
          </Link>
          <Link
            to="/offline"
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            activeProps={{ className: 'text-primary font-semibold' }}
          >
            Offline
          </Link>
          {isAdmin && (
            <Link
              to="/moderator"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              activeProps={{ className: 'text-primary font-semibold' }}
            >
              Moderator
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/notes-logo.dim_256x256.png"
              alt="College Notes Portal"
              className="h-10 w-10"
            />
            <span className="font-bold text-xl text-foreground hidden sm:inline">College Notes</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LoginButton />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
