import { cn } from "@/lib/utils";

export function DialogWrapper({
  children,
  open,
  className,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-30 flex items-center justify-center"
    >
      <div className="absolute inset-0 backdrop-blur-sm transition-opacity" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={"Dialog"}
        className={cn(
          `bg-card-color overflow-scroll relative h-full max-h-[calc(100vh-100px)] z-10 mx-4 max-w-4xl w-full scale-100 transform-gpu rounded-2xl p-6 opacity-100 shadow-md transition-all dark:bg-neutral-900`,
          className,
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>


    </div>
  );
}

