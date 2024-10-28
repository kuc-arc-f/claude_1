import React from 'react';
import { useState, useEffect } from 'react';
import { z } from 'zod';

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

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  food_melon: z.boolean(),
  food_grape: z.boolean(),
  pub_date1: z.string(),
  pub_date2: z.string(),
  pub_date3: z.string(),
  pub_date4: z.string(),
  pub_date5: z.string(),
  pub_date6: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
  qty4: z.string().min(1, "数量4を入力してください"),
  qty5: z.string().min(1, "数量5を入力してください"),
  qty6: z.string().min(1, "数量6を入力してください"),
});
export type TodoType = z.infer<typeof TodoSchema>;

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初期値の取得
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
console.log("#useLocalStorage");
console.log(JSON.parse(item));
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値が変更されたときにlocalStorageを更新
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
//
import Head from '../components/Head';
//
const initialFormData: Omit<TodoType, 'id'> = {
  title: '',
  content: '',
  public: 'public',
  food_orange: false,
  food_apple: false,
  food_banana: false,
  food_melon: false,
  food_grape: false,
  pub_date1: '',
  pub_date2: '',
  pub_date3: '',
  pub_date4: '',
  pub_date5: '',
  pub_date6: '',
  qty1: '',
  qty2: '',
  qty3: '',
  qty4: '',
  qty5: '',
  qty6: '',
};

type ValidationErrors = {
  [key in keyof TodoType]?: string[];
};
const storageKey = "claude_1_form5";
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
//const columns: ColumnDef<Payment>[] = [
const columns: ColumnDef<TodoType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      //const amount = parseFloat(row.getValue("amount"))
      return <div className="text-right font-medium">A</div>
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
      <div className="flex gap-2">
        <Button variant="outline">
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
  //const [todos, setTodos] = useLocalStorage<TodoType[]>(storageKey, []);
  const [todos, setTodos] = useState([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
console.log("#DataTable");
console.log(todos);
console.log(data);
  //
  useEffect(() => {
    (async() => {
      const item = window.localStorage.getItem(storageKey);
      console.log("#useLocalStorage");
      const target = JSON.parse(item);
      console.log(target);
      setTodos(target);
      //setUpdatetime(new Date().toString());
    })()
  }, []);
  //data
  const table = useReactTable({
    todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    //globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      //globalFilter,
      //columnFilters,
    },
  });
  //if(table.getRowModel()){
  //  console.log("le=", table.getRowModel().rows?.length);
  //}
  if(!todos || todos.length < 1){
    return "";
  }
  //table.getRowModel().rows?.length
  console.log(table.getRowModel());

  return (
  <>
    <Head />
    <div className="w-full">
      <h1 className="text-4xl font-bold">Test2</h1>
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
            
          {/*
          {table.getRowModel().rows? '1': null }
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
              </TableRow>
            )}
          </TableBody>          
          
          */}
                 
        </Table>
      </div>
    </div>  
  </>

  );
}
