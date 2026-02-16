import { cn } from "@/lib/utils";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export function AdminCard({ title, description, action, children, className, compact = false, ...props }: AdminCardProps) {
  return (
    <div className={cn("metron-card flex flex-col bg-white", className)} {...props}>
       {(title || action) && (
         <div className={cn(
            "border-b border-gray-100 flex items-center justify-between min-h-[50px]",
            compact ? "px-4 py-3" : "px-6 py-5 min-h-[70px]"
         )}>
            <div className="space-y-0.5">
                {title && <h3 className={cn("font-bold text-gray-900", compact ? "text-base" : "text-lg")}>{title}</h3>}
                {description && <p className="text-xs text-gray-500 font-medium">{description}</p>}
            </div>
            {action && <div>{action}</div>}
         </div>
       )}
       <div className={cn(compact ? "p-4" : "p-6")}>
          {children}
       </div>
    </div>
  )
}
