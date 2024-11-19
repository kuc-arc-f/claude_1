import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // TODOの取得
  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos?search=${searchQuery}`);
      const data = await response.json();
      //console.log(data);
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [searchQuery]);

  // TODOの追加
  const handleAddTodo = async () => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await response.json();
      
      if (response.ok) {
        await fetchTodos();
        setNewTodo('');
        setIsAddDialogOpen(false);
        setValidationError('');
      } else {
        setValidationError(data.error[0].message);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // TODOの更新
  const handleUpdateTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTodo.title }),
      });
      const data = await response.json();
      
      if (response.ok) {
        await fetchTodos();
        setEditingTodo(null);
        setIsEditDialogOpen(false);
        setValidationError('');
      } else {
        setValidationError(data.error[0].message);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // TODOの削除
  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">TODO アプリ</h1>
      
      {/* 検索フィールド */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="TODOを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* 追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">新規TODO追加</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規TODOの追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="新しいTODO"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            {validationError && (
              <p className="text-red-500 text-sm">{validationError}</p>
            )}
            <Button onClick={handleAddTodo}>追加</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODOの編集</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <div className="space-y-4">
              <Input
                type="text"
                value={editingTodo.title}
                onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
              />
              {validationError && (
                <p className="text-red-500 text-sm">{validationError}</p>
              )}
              <Button onClick={handleUpdateTodo}>更新</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* TODOリスト */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between p-4 bg-white rounded shadow">
            <span>{todo.title}</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTodo(todo);
                  setIsEditDialogOpen(true);
                }}
              >
                編集
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
