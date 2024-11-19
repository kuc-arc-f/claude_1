import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const TodoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  pubDate: z.string(),
  qty1: z.string().min(1, "数量1は必須です"),
  qty2: z.string().min(1, "数量2は必須です"),
  qty3: z.string().min(1, "数量3は必須です"),
});

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    public: false,
    foodOrange: false,
    foodApple: false,
    foodBanana: false,
    pubDate: '',
    qty1: '',
    qty2: '',
    qty3: '',
  });

  useEffect(() => {
    fetchTodos();
  }, [searchQuery]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos${searchQuery ? `?search=${searchQuery}` : ''}`);
      const data = await response.json();
      //console.log( data );
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      TodoSchema.parse(formData);

      const response = await fetch(
        `/api/todos${editingTodo ? `/${editingTodo.id}` : ''}`,
        {
          method: editingTodo ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      await fetchTodos();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = {};
        error.errors.forEach((err) => {
          errorMessages[err.path[0]] = err.message;
        });
        setErrors(errorMessages);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await fetch(`/api/todos/${id}`, {
          method: 'DELETE',
        });
        await fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      content: todo.content,
      public: todo.public,
      foodOrange: todo.foodOrange,
      foodApple: todo.foodApple,
      foodBanana: todo.foodBanana,
      pubDate: new Date(todo.pubDate).toISOString().split('T')[0],
      qty1: todo.qty1,
      qty2: todo.qty2,
      qty3: todo.qty3,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      public: false,
      foodOrange: false,
      foodApple: false,
      foodBanana: false,
      pubDate: '',
      qty1: '0',
      qty2: '0',
      qty3: '0',
    });
    setEditingTodo(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xs"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>新規作成</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'TODOを編集' : '新規TODO作成'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="content">内容</Label>
              <Input
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            </div>

            <div>
              <Label>公開設定</Label>
              <RadioGroup
                value={formData.public.toString()}
                onValueChange={(value) => setFormData({ ...formData, public: value === 'true' })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="public" />
                  <Label htmlFor="public">公開</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="private" />
                  <Label htmlFor="private">非公開</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>食べ物</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodOrange"
                  checked={formData.foodOrange}
                  onCheckedChange={(checked) => setFormData({ ...formData, foodOrange: checked })}
                />
                <Label htmlFor="foodOrange">オレンジ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodApple"
                  checked={formData.foodApple}
                  onCheckedChange={(checked) => setFormData({ ...formData, foodApple: checked })}
                />
                <Label htmlFor="foodApple">りんご</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodBanana"
                  checked={formData.foodBanana}
                  onCheckedChange={(checked) => setFormData({ ...formData, foodBanana: checked })}
                />
                <Label htmlFor="foodBanana">バナナ</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="pubDate">公開日</Label>
              <Input
                type="date"
                id="pubDate"
                value={formData.pubDate}
                onChange={(e) => setFormData({ ...formData, pubDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="qty1">数量1</Label>
              <Input
                id="qty1"
                value={formData.qty1}
                onChange={(e) => setFormData({ ...formData, qty1: e.target.value })}
              />
              {errors.qty1 && <p className="text-red-500 text-sm">{errors.qty1}</p>}
            </div>

            <div>
              <Label htmlFor="qty2">数量2</Label>
              <Input
                id="qty2"
                value={formData.qty2}
                onChange={(e) => setFormData({ ...formData, qty2: e.target.value })}
              />
              {errors.qty2 && <p className="text-red-500 text-sm">{errors.qty2}</p>}
            </div>

            <div>
              <Label htmlFor="qty3">数量3</Label>
              <Input
                id="qty3"
                value={formData.qty3}
                onChange={(e) => setFormData({ ...formData, qty3: e.target.value })}
              />
              {errors.qty3 && <p className="text-red-500 text-sm">{errors.qty3}</p>}
            </div>

            <Button type="submit">{editingTodo ? '更新' : '作成'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-4">
        {todos.map((todo) => (
          <div key={todo.id} className="border p-4 mb-2 rounded">
            <h3 className="font-bold">{todo.title}</h3>
            <p>{todo.content}</p>
            <div className="mt-2">
              <Button variant="outline" className="mr-2" onClick={() => handleEdit(todo)}>
                編集
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(todo.id)}>
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
