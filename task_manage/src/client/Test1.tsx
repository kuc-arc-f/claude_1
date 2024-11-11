import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
  GlobalFilterFn,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";
//
import Head from '../components/Head';

// データの型定義
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// サンプルデータ
const data: Payment[] = [
  {
    id: "1",
    amount: 100,
    status: "pending",
    email: "test1@example.com",
  },
  {
    id: "2",
    amount: 200,
    status: "success",
    email: "test2@example.com",
  },
  // ... その他のデータ
];

// グローバル検索フィルター関数
const fuzzyFilter: GlobalFilterFn<any> = (row, columnId, value, addMeta) => {
  const itemValue = row.getValue(columnId);
  if (itemValue == null) return false;
  
  const searchValue = value.toLowerCase();
  const itemString = String(itemValue).toLowerCase();
  
  return itemString.includes(searchValue);
};

// カラム定義
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div className="text-right font-medium">${amount}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`capitalize ${
          status === "success" ? "text-green-600" :
          status === "failed" ? "text-red-600" :
          "text-gray-600"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const payment = row.original;
      //payment.id
      return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => {
          console.log("id=", payment.id);
          //handleEdit(todo)

        }}>
          Edit
        </Button>      
        <Button
          variant="destructive"
        >
          Delete
        </Button>
      </div>
      )
    },
  },
];

export default function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
  });

  return (
  <>
    <Head />
    <div className="w-full">
      <h1 className="text-4xl font-bold">Test1</h1>
      <hr className="my-2" />
      <div className="flex items-center py-4 gap-x-4">
        {/* グローバル検索 */}
        <div className="flex-1 flex items-center gap-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {/* Email検索 */}
        <div className="flex items-center gap-x-2">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("email")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
        
        {/* Status検索 */}
        <div className="flex items-center gap-x-2">
          <Input
            placeholder="Filter status..."
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("status")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>  
  </>

  );
}
