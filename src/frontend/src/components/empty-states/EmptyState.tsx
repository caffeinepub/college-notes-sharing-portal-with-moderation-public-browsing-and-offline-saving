interface EmptyStateProps {
  title: string;
  description: string;
  showIllustration?: boolean;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, showIllustration = true, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {showIllustration && (
        <img
          src="/assets/generated/notes-illustration.dim_1200x800.png"
          alt="No notes"
          className="w-full max-w-md mb-8 opacity-80"
        />
      )}
      <h3 className="text-2xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
