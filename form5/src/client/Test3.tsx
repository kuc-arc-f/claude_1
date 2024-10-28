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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [updatetime, setUpdatetime] = React.useState("")
  //
  React.useEffect(() => {
    (async() => {
      const item = window.localStorage.getItem(storageKey);
      console.log("#useEffect");
      //console.log(item);
      if(item){
        const target = JSON.parse(item);
        console.log("parse:");
        console.log(target);
        todos = target;
        //setUpdatetime(new Date().toString());
      }
    })()
  }, []);
  //
  const getStorageItem = async function(){

  }

  console.log(todos);
  //data
  const table = useReactTable({
    data,
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
    const target = todos;
    target.push(item);
    console.log(target);
    window.localStorage.setItem(storageKey, JSON.stringify(todos));
  }
  //
  return (
    <div className="w-full">
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
          {/* table.getRowModel().rows?.length */}
          {data.length > 0 ? '1': '0'}
          {data.length > 0 ? '3'
          : (
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
