import React, { useState, useMemo } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Search, ArrowUpDown } from "lucide-react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editTodo, setEditTodo] = useState({ id: null, text: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);

  // Add new todo
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        createdAt: new Date().toLocaleString(),
      }]);
      setNewTodo("");
    }
  };

  // Delete todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Start editing todo
  const handleEditStart = (todo) => {
    setEditTodo({ id: todo.id, text: todo.text });
    setIsDialogOpen(true);
  };

  // Save edited todo
  const handleEditSave = () => {
    setTodos(todos.map(todo => 
      todo.id === editTodo.id ? { ...todo, text: editTodo.text } : todo
    ));
    setIsDialogOpen(false);
    setEditTodo({ id: null, text: "" });
  };

  // Table columns definition
  const columns = useMemo(() => [
    {
      accessorKey: 'text',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            タスク
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            作成日時
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const todo = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleEditStart(todo)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => handleDeleteTodo(todo.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ], []);

  // Initialize table
  const table = useReactTable({
    data: todos,
    columns,
    state: {
      sorting,
      globalFilter: searchTerm,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
      
      {/* Search Bar */}
      <div className="flex gap-2 items-center mb-4">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="TODOを検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Add Todo Form */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="新しいTODOを入力..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <Button onClick={handleAddTodo}>
          <Plus className="w-4 h-4 mr-2" />
          追加
        </Button>
      </div>

      {/* Todo Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODOを編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editTodo.text}
              onChange={(e) => setEditTodo({ ...editTodo, text: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleEditSave}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoApp;
