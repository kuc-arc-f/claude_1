// types.ts
import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  status: z.enum(["none", "working", "complete"]),
  task_start: z.string().min(1, "開始日を入力してください"),
  task_end: z.string().min(1, "終了日を入力してください"),
});

export type Todo = z.infer<typeof TodoSchema>;

// TodoApp.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<Todo>({
    title: '',
    content: '',
    status: 'none',
    task_start: '',
    task_end: '',
  });

  const resetFormData = () => {
    setFormData({
      title: '',
      content: '',
      status: 'none',
      task_start: '',
      task_end: '',
    });
    setEditingTodo(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    try {
      TodoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {[key: string]: string} = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (editingTodo) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? { ...formData, id: todo.id } : todo
      ));
    } else {
      setTodos([...todos, { ...formData, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    resetFormData();
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData(todo);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleInputChange = (field: keyof Todo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 入力時にリアルタイムバリデーション
    try {
      TodoSchema.pick({ [field]: true }).parse({ [field]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODOアプリ</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          新規TODO作成
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <Search className="w-5 h-5" />
          <Input
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <Card key={todo.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-bold">{todo.title}</h3>
                  <p className="text-gray-600">{todo.content}</p>
                  <div className="text-sm text-gray-500">
                    <p>ステータス: {todo.status}</p>
                    <p>開始日: {todo.task_start}</p>
                    <p>終了日: {todo.task_end}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(todo)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(todo.id!)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? 'TODO編集' : '新規TODO作成'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={formData.title}
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
              <Label htmlFor="content">内容</Label>
              <Input
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.content}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Label>ステータス</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">未着手</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="working" id="working" />
                  <Label htmlFor="working">作業中</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complete" id="complete" />
                  <Label htmlFor="complete">完了</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="task_start">開始日</Label>
              <Input
                id="task_start"
                type="date"
                value={formData.task_start}
                onChange={(e) => handleInputChange('task_start', e.target.value)}
                className={errors.task_start ? 'border-red-500' : ''}
              />
              {errors.task_start && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.task_start}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Label htmlFor="task_end">終了日</Label>
              <Input
                id="task_end"
                type="date"
                value={formData.task_end}
                onChange={(e) => handleInputChange('task_end', e.target.value)}
                className={errors.task_end ? 'border-red-500' : ''}
              />
              {errors.task_end && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.task_end}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetFormData();
            }}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit}>
              {editingTodo ? '更新' : '作成'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoApp;
