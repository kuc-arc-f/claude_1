// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { z } from 'zod';


export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  food_melon: z.boolean(),
  food_grape: z.boolean(),
  pub_date1: z.string(),
  pub_date2: z.string(),
  pub_date3: z.string(),
  pub_date4: z.string(),
  pub_date5: z.string(),
  pub_date6: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
  qty4: z.string().min(1, "数量4を入力してください"),
  qty5: z.string().min(1, "数量5を入力してください"),
  qty6: z.string().min(1, "数量6を入力してください"),
});
export type TodoType = z.infer<typeof TodoSchema>;

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初期値の取得
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値が変更されたときにlocalStorageを更新
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// TodoApp.tsx
import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from 'lucide-react';
//import { toast } from "@/components/ui/use-toast";
import { toast } from "@/hooks/use-toast";
//
import Head from '../components/Head';
//
const initialFormData: Omit<TodoType, 'id'> = {
  title: '',
  content: '',
  public: 'public',
  food_orange: false,
  food_apple: false,
  food_banana: false,
  food_melon: false,
  food_grape: false,
  pub_date1: '',
  pub_date2: '',
  pub_date3: '',
  pub_date4: '',
  pub_date5: '',
  pub_date6: '',
  qty1: '',
  qty2: '',
  qty3: '',
  qty4: '',
  qty5: '',
  qty6: '',
};

type ValidationErrors = {
  [key in keyof TodoType]?: string[];
};
const storageKey = "claude_1_form5";
//
const TodoApp: React.FC = () => {
  // localStorageフックを使用してTODOsを管理
  const [todos, setTodos] = useLocalStorage<TodoType[]>(storageKey, []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<TodoType | null>(null);
  const [formData, setFormData] = useState<Omit<TodoType, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const validateForm = (): boolean => {
    try {
      TodoSchema.parse({ ...formData });
      setErrors({});
      return true;
    } catch (error) {
console.error(error);
      if (error instanceof z.ZodError) {
        const formattedErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const field = err.path[0] as keyof TodoType;
            if (!formattedErrors[field]) {
              formattedErrors[field] = [];
            }
            formattedErrors[field]?.push(err.message);
          }
        });
        setErrors(formattedErrors);
        
        const errorMessages = error.errors.map(err => err.message).join('\n');
        toast({
          title: "入力エラー",
          description: errorMessages,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (): void => {
console.log("#handleSubmit");
    if (!validateForm()) return;

    if (isEditMode && currentTodo) {
      setTodos(todos.map(todo => 
        todo.id === currentTodo.id ? { ...formData, id: todo.id } : todo
      ));
      toast({
        title: "更新完了",
        description: "TODOが正常に更新されました。",
      });
    } else {
      const newTodo = { ...formData, id: Date.now() };
      setTodos([...todos, newTodo]);
      toast({
        title: "作成完了",
        description: "新しいTODOが作成されました。",
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = (): void => {
    setFormData(initialFormData);
    setErrors({});
    setIsEditMode(false);
    setCurrentTodo(null);
  };

  const handleEdit = (todo: TodoType): void => {
    setIsEditMode(true);
    setCurrentTodo(todo);
    setFormData(todo);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number): void => {
    const confirmed = window.confirm('このTODOを削除してもよろしいですか？');
    if (confirmed) {
      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: "削除完了",
        description: "TODOが削除されました。",
      });
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <>
    <Head />
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">FormTest5</h1>
      <hr className="my-2" />
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="検索..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>新規TODO</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'TODO編集' : '新規TODO作成'}</DialogTitle>
            </DialogHeader>
            {/* フォームの内容は変更なし */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={errors.content ? 'border-red-500' : ''}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content[0]}</p>
                )}
              </div>

              <div>
                <Label>公開設定</Label>
                <RadioGroup
                  name="public"
                  value={formData.public}
                  onValueChange={(value: "public" | "private") => 
                    setFormData(prev => ({ ...prev, public: value }))}
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

              <div>
                <Label>フルーツ選択</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['orange', 'apple', 'banana', 'melon', 'grape'].map((fruit) => (
                    <div key={fruit} className="flex items-center space-x-2">
                      <Checkbox
                        id={`food_${fruit}`}
                        name={`food_${fruit}`}
                        checked={formData[`food_${fruit as 'orange' | 'apple' | 'banana' | 'melon' | 'grape'}`]}
                        onCheckedChange={(checked: boolean) =>
                          setFormData(prev => ({ 
                            ...prev, 
                            [`food_${fruit}`]: checked 
                          }))
                        }
                      />
                      <Label htmlFor={`food_${fruit}`}>{fruit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={`date${num}`}>
                    <Label htmlFor={`pub_date${num}`}>日付{num}</Label>
                    <Input
                      type="date"
                      id={`pub_date${num}`}
                      name={`pub_date${num}`}
                      value={formData[`pub_date${num as 1 | 2 | 3 | 4 | 5 | 6}`]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={`qty${num}`}>
                    <Label htmlFor={`qty${num}`}>数量{num}</Label>
                    <Input
                      type="text"
                      id={`qty${num}`}
                      name={`qty${num}`}
                      value={formData[`qty${num as 1 | 2 | 3 | 4 | 5 | 6}`]}
                      onChange={handleInputChange}
                      className={errors[`qty${num}`] ? 'border-red-500' : ''}
                    />
                    {errors[`qty${num}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`qty${num}`]![0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={handleSubmit}>
                {isEditMode ? '更新' : '作成'}
              </Button>
            </div>
            {/* ... 前のコードと同じ ... */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            TODOがありません
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <Card key={todo.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{todo.title}</h3>
                    <p className="text-gray-600">{todo.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(todo)}>
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => todo.id && handleDelete(todo.id)}
                    >
                      削除
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>公開設定: {todo.public}</div>
                  <div>
                    フルーツ:
                    {['orange', 'apple', 'banana', 'melon', 'grape']
                      .filter(fruit => todo[`food_${fruit as 'orange' | 'apple' | 'banana' | 'melon' | 'grape'}`])
                      .join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  </>
  );
};

export default TodoApp;