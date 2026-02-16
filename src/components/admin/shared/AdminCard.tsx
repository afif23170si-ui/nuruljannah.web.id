import { cn } from "@/lib/utils";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminCard({ title, description, action, children, className, ...props }: AdminCardProps) {
  return (
    <div className={cn("metron-card flex flex-col bg-white", className)} {...props}>
       {(title || action) && (
         <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between min-h-[70px]">
            <div className="space-y-1">
                {title && <h3 className="font-bold text-gray-900 text-lg">{title}</h3>}
                {description && <p className="text-sm text-gray-500 font-medium">{description}</p>}
            </div>
            {action && <div>{action}</div>}
         </div>
       )}
       <div className="p-6">
          {children}
       </div>
    </div>
  )
}
