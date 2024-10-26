import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
//
import Head from '../components/Head';

// zodスキーマの定義
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.string(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
});

type TodoSchema = z.infer<typeof todoSchema>;

interface Todo extends TodoSchema {
  id: number;
}

interface ValidationErrors {
  [key: string]: string[];
}

//const LOCAL_STORAGE_KEY = 'todos';
const LOCAL_STORAGE_KEY = 'claude_1_todos';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<TodoSchema>({
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

  // LocalStorageからデータを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  // TODOsが変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const resetForm = () => {
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
    setCurrentTodo(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    try {
      todoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          if (!validationErrors[path]) {
            validationErrors[path] = [];
          }
          validationErrors[path].push(err.message);
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (currentTodo) {
      setTodos(todos.map(todo => 
        todo.id === currentTodo.id ? { ...formData, id: todo.id } : todo
      ));
    } else {
      setTodos([...todos, { ...formData, id: Date.now() }]);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (todo: Todo) => {
    setCurrentTodo(todo);
    setFormData(todo);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ErrorMessage: React.FC<{ fieldName: keyof TodoSchema }> = ({ fieldName }) => {
    if (!errors[fieldName]) return null;
    return (
      <div className="text-red-500 text-sm mt-1">
        {errors[fieldName].map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  };

  return (
  <>
    <Head />
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODOアプリ</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> 新規作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentTodo ? 'TODO編集' : '新規TODO作成'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">タイトル</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  <ErrorMessage fieldName="title" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">内容</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className={errors.content ? "border-red-500" : ""}
                  />
                  <ErrorMessage fieldName="content" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">公開設定</Label>
                <RadioGroup
                  className="col-span-3"
                  value={formData.public}
                  onValueChange={(value) => setFormData({ ...formData, public: value })}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">フルーツ</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.food_orange}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, food_orange: checked as boolean })}
                    />
                    <Label>オレンジ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.food_apple}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, food_apple: checked as boolean })}
                    />
                    <Label>りんご</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.food_banana}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, food_banana: checked as boolean })}
                    />
                    <Label>バナナ</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">公開日</Label>
                <Input
                  className="col-span-3"
                  type="date"
                  value={formData.pub_date}
                  onChange={(e) => setFormData({ ...formData, pub_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">数量1</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.qty1}
                    onChange={(e) => setFormData({ ...formData, qty1: e.target.value })}
                    className={errors.qty1 ? "border-red-500" : ""}
                  />
                  <ErrorMessage fieldName="qty1" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">数量2</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.qty2}
                    onChange={(e) => setFormData({ ...formData, qty2: e.target.value })}
                    className={errors.qty2 ? "border-red-500" : ""}
                  />
                  <ErrorMessage fieldName="qty2" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">数量3</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.qty3}
                    onChange={(e) => setFormData({ ...formData, qty3: e.target.value })}
                    className={errors.qty3 ? "border-red-500" : ""}
                  />
                  <ErrorMessage fieldName="qty3" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit}>
                {currentTodo ? '更新' : '作成'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <div key={todo.id} className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{todo.title}</h3>
                <p className="text-sm text-gray-600">{todo.content}</p>
                <p className="text-sm text-gray-500">公開設定: {todo.public}</p>
                <p className="text-sm text-gray-500">公開日: {todo.pub_date}</p>
                <div className="text-sm text-gray-500">
                  フルーツ: {' '}
                  {[
                    todo.food_orange && 'オレンジ',
                    todo.food_apple && 'りんご',
                    todo.food_banana && 'バナナ'
                  ].filter(Boolean).join(', ')}
                </div>
                <div className="text-sm text-gray-500">
                  数量: {todo.qty1}, {todo.qty2}, {todo.qty3}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(todo)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(todo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>  
  </>

  );
};

export default TodoApp;
