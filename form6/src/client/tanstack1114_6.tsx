import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pencil, Trash2, Plus } from 'lucide-react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({ title: '', content: '' });
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [errors, setErrors] = useState({ title: '', content: '' });

  const validateForm = () => {
    const newErrors = {
      title: '',
      content: ''
    };
    let isValid = true;

    // タイトルのバリデーション
    if (currentTodo.title.length <= 1) {
      newErrors.title = 'タイトルは2文字以上で入力してください';
      isValid = false;
    }

    // 内容のバリデーション
    if (!currentTodo.content.trim()) {
      newErrors.content = '内容は必須項目です';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddTodo = () => {
    if (validateForm()) {
      setTodos([...todos, { ...currentTodo, id: Date.now() }]);
      setCurrentTodo({ title: '', content: '' });
      setErrors({ title: '', content: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditTodo = () => {
    if (validateForm()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodoId ? { ...currentTodo, id: editingTodoId } : todo
        )
      );
      setCurrentTodo({ title: '', content: '' });
      setErrors({ title: '', content: '' });
      setIsEditDialogOpen(false);
      setEditingTodoId(null);
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setCurrentTodo({ title: todo.title, content: todo.content });
    setEditingTodoId(todo.id);
    setErrors({ title: '', content: '' });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (field, value) => {
    setCurrentTodo({ ...currentTodo, [field]: value });
    // 入力時にエラーをクリア
    setErrors({ ...errors, [field]: '' });
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DialogFields = () => (
    <div className="grid gap-4 py-4">
      <div>
        <Input
          placeholder="タイトル"
          value={currentTodo.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{errors.title}</AlertDescription>
          </Alert>
        )}
      </div>
      <div>
        <Input
          placeholder="内容"
          value={currentTodo.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className={errors.content ? 'border-red-500' : ''}
        />
        {errors.content && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{errors.content}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>TODOの追加</DialogTitle>
            </DialogHeader>
            <DialogFields />
            <DialogFooter>
              <Button onClick={handleAddTodo}>追加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>内容</TableHead>
            <TableHead className="w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.content}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => startEdit(todo)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODOの編集</DialogTitle>
          </DialogHeader>
          <DialogFields />
          <DialogFooter>
            <Button onClick={handleEditTodo}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoApp;
