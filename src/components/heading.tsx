import { cn } from "@/lib/utils";

interface headingProps {
  title: string;
  description: string;
  className?: string;
}

export default function Heading({
  title,
  description,
  className,
}: headingProps) {
  return (
    <div className={cn(className)}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
