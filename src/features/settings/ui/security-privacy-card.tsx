export const PrivacyCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
      <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
        <span className="text-teal-400">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
