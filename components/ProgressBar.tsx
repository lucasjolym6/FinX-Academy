interface ProgressBarProps {
  progress: number;
  color?: "accent" | "primary" | "green" | "blue";
  height?: "sm" | "md" | "lg";
}

export default function ProgressBar({
  progress,
  color = "accent",
  height = "md",
}: ProgressBarProps) {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    accent: "bg-accent",
    primary: "bg-primary",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
      <div
        className={`${colorClasses[color]} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
