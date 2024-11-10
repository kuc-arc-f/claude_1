import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Head from '../components/Head';
//
const TodoApp = () => {
  const [todos, setTodos] = useState([
    { id: 1, title: "買い物に行く", completed: false },
    { id: 2, title: "レポートを書く", completed: true },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  const columnHelper = createColumnHelper();
  
  const columns = [
    columnHelper.accessor('completed', {
      header: '完了',
      cell: ({ row }) => (
        <Checkbox
          checked={row.getValue('completed')}
          onCheckedChange={(checked) => {
            const newTodos = [...todos];
            const index = newTodos.findIndex(todo => todo.id === row.original.id);
            newTodos[index] = { ...newTodos[index], completed: checked };
            setTodos(newTodos);
          }}
        />
      ),
    }),
    columnHelper.accessor('title', {
      header: 'タスク',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAdd = () => {
    if (newTodo.trim()) {
      if (editingTodo) {
        setTodos(todos.map(todo =>
          todo.id === editingTodo.id
            ? { ...todo, title: newTodo }
            : todo
        ));
        setEditingTodo(null);
      } else {
        setTodos([
          ...todos,
          {
            id: todos.length + 1,
            title: newTodo,
            completed: false,
          },
        ]);
      }
      setNewTodo("");
      setIsOpen(false);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.title);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
  <>
    <Head />
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODOリスト</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setNewTodo("");
              setEditingTodo(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? 'TODOを編集' : '新規TODOを追加'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="TODOを入力..."
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleAdd}>
                {editingTodo ? '更新' : '追加'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  
  </>
  );
};

export default TodoApp;
