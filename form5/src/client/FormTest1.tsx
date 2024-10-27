// types.ts
import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
});

export type TodoType = z.infer<typeof TodoSchema>;

// TodoApp.tsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from 'lucide-react';
//import { TodoSchema, TodoType } from './types';
import Head from '../components/Head';
//
const TodoApp = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TodoType>({
    title: '',
    content: '',
    public: 'public',
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: '',
    qty1: '',
    qty2: '',
    qty3: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // 入力時にエラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      public: value as "public" | "private"
    }));
  };

  const validateForm = (): boolean => {
    try {
      TodoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingTodo) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? { ...formData, id: todo.id } : todo
      ));
      setEditingTodo(null);
    } else {
      setTodos([...todos, { ...formData, id: Date.now() }]);
    }

    setFormData({
      title: '',
      content: '',
      public: 'public',
      food_orange: false,
      food_apple: false,
      food_banana: false,
      pub_date: '',
      qty1: '',
      qty2: '',
      qty3: '',
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (todo: TodoType) => {
    setEditingTodo(todo);
    setFormData(todo);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <>
    <Head />
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>

      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Search className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">新規TODO追加</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'TODO編集' : '新規TODO追加'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">内容</Label>
              <Input
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            <div>
              <Label>公開設定</Label>
              <RadioGroup
                value={formData.public}
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">公開</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">非公開</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>フルーツ選択</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="orange"
                    name="food_orange"
                    checked={formData.food_orange}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, food_orange: !!checked }))
                    }
                  />
                  <Label htmlFor="orange">オレンジ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="apple"
                    name="food_apple"
                    checked={formData.food_apple}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, food_apple: !!checked }))
                    }
                  />
                  <Label htmlFor="apple">りんご</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="banana"
                    name="food_banana"
                    checked={formData.food_banana}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, food_banana: !!checked }))
                    }
                  />
                  <Label htmlFor="banana">バナナ</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="pub_date">公開日</Label>
              <Input
                type="date"
                id="pub_date"
                name="pub_date"
                value={formData.pub_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="qty1">数量1</Label>
                <Input
                  type="text"
                  id="qty1"
                  name="qty1"
                  value={formData.qty1}
                  onChange={handleInputChange}
                  className={errors.qty1 ? "border-red-500" : ""}
                />
                {errors.qty1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.qty1}</p>
                )}
              </div>
              <div>
                <Label htmlFor="qty2">数量2</Label>
                <Input
                  type="text"
                  id="qty2"
                  name="qty2"
                  value={formData.qty2}
                  onChange={handleInputChange}
                  className={errors.qty2 ? "border-red-500" : ""}
                />
                {errors.qty2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.qty2}</p>
                )}
              </div>
              <div>
                <Label htmlFor="qty3">数量3</Label>
                <Input
                  type="text"
                  id="qty3"
                  name="qty3"
                  value={formData.qty3}
                  onChange={handleInputChange}
                  className={errors.qty3 ? "border-red-500" : ""}
                />
                {errors.qty3 && (
                  <p className="text-red-500 text-sm mt-1">{errors.qty3}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              {editingTodo ? '更新' : '追加'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <Card key={todo.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{todo.title}</h3>
                  <p className="text-sm text-gray-600">{todo.content}</p>
                  <p className="text-sm">公開設定: {todo.public}</p>
                  <p className="text-sm">公開日: {todo.pub_date}</p>
                  <div className="text-sm">
                    フルーツ: {[
                      todo.food_orange && 'オレンジ',
                      todo.food_apple && 'りんご',
                      todo.food_banana && 'バナナ'
                    ].filter(Boolean).join(', ')}
                  </div>
                  <div className="text-sm">
                    数量: {todo.qty1}, {todo.qty2}, {todo.qty3}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => handleEdit(todo)}>
                    編集
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDelete(todo.id!)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

  </>
  );
};

export default TodoApp;
