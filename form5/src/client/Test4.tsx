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
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// サンプルデータ
const data2: any[] = [];
const data: any[] = [
  {
    id: 1,
    title: "t1",
  },
  {
    id: 2,
    title: "t2",
  },
  // ... その他のデータ
];

// カラム定義
const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
];
const storageKey = "claude_1_test3";
let todos: any[] = [];
//
export default function DataTable() {
  console.log("#DataTable");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [updatetime, setUpdatetime] = React.useState("")
  //
  React.useEffect(() => {
    (async() => {
    })()
  }, []);

  console.log(data);
  //data
  const table = useReactTable({
    data: data2,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });
  //if(!todos || todos.length < 1){
  //  return "";
  //}
  const testProc = function(){
    const dt = new Date().getTime();
    console.log("testProc:", dt);
    const item = {
      id: dt,
      title: "title-" + dt,
    };
    data2.push(item);
    console.log(data2);
    setUpdatetime(new Date().toString());
    //window.localStorage.setItem(storageKey, JSON.stringify(todos));
  }
  //
  return (
    <div className="w-full">
      <div>Test4</div>
      <hr />
      <button onClick={()=>{testProc()}} >[ test1 ]</button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
    </div>
  );
}
