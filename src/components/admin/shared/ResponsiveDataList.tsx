import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

export interface Column<T> {
  header: ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
  headClassName?: string;
}

interface ResponsiveDataListProps<T> {
  data: T[];
  columns: Column<T>[];
  renderMobileItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: ReactNode;
}

export function ResponsiveDataList<T>({
  data,
  columns,
  renderMobileItem,
  keyExtractor,
  emptyMessage = "No data available.",
}: ResponsiveDataListProps<T>) {
  if (data.length === 0) {
    return <div className="text-center py-8">{emptyMessage}</div>;
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-100">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={`text-xs font-bold text-gray-400 uppercase tracking-wider py-4 ${col.headClassName || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
              >
                {columns.map((col, index) => (
                  <TableCell
                    key={index}
                    className={`py-4 ${col.className || ""}`}
                  >
                    {col.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div key={keyExtractor(item)}>{renderMobileItem(item)}</div>
        ))}
      </div>
    </div>
  );
}
