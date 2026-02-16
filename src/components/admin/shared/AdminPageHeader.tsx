import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, breadcrumbs, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2" />
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && <div className="flex gap-3">{action}</div>}
      </div>
    </div>
  )
}
