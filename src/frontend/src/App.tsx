import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/header/AppHeader';
import PublicBrowsePage from './pages/PublicBrowsePage';
import NoteDetailPage from './pages/NoteDetailPage';
import SubmitNotePage from './pages/SubmitNotePage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import ModeratorQueuePage from './pages/moderation/ModeratorQueuePage';
import ModeratorReviewPage from './pages/moderation/ModeratorReviewPage';
import OfflinePage from './pages/OfflinePage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
      <ProfileSetupModal />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicBrowsePage,
});

const noteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/note/$noteId',
  component: NoteDetailPage,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: SubmitNotePage,
});

const mySubmissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-submissions',
  component: MySubmissionsPage,
});

const moderatorQueueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moderator',
  component: ModeratorQueuePage,
});

const moderatorReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moderator/review/$noteId',
  component: ModeratorReviewPage,
});

const offlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/offline',
  component: OfflinePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  noteDetailRoute,
  submitRoute,
  mySubmissionsRoute,
  moderatorQueueRoute,
  moderatorReviewRoute,
  offlineRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
