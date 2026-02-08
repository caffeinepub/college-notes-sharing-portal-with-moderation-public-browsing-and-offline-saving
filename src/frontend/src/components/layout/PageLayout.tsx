import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function PageLayout({ children, title, description, maxWidth = 'xl' }: PageLayoutProps) {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${maxWidthClass} mx-auto`}>
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>}
            {description && <p className="text-muted-foreground text-lg">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
