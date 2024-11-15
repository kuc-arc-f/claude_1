import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert"

// バリデーションスキーマの定義
const todoSchema = z.object({
  title: z.string()
    .min(2, { message: "タイトルは2文字以上で入力してください" }),
  content: z.string()
    .min(1, { message: "内容を入力してください" }),
  public: z.string(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string()
    .min(1, { message: "数量1を入力してください" }),
  qty2: z.string()
    .min(1, { message: "数量2を入力してください" }),
  qty3: z.string()
    .min(1, { message: "数量3を入力してください" })
});

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e) => {
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
    // 入力時にそのフィールドのエラーをクリア
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handlePublicChange = (value) => {
    setFormData(prev => ({
      ...prev,
      public: value
    }));
  };

  const validateForm = () => {
    try {
      todoSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach(err => {
        const path = err.path[0];
        formattedErrors[path] = err.message;
      });
      setValidationErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (isEditing && currentTodo) {
      setTodos(todos.map(todo => 
        todo.id === currentTodo.id ? { ...formData, id: todo.id } : todo
      ));
    } else {
      setTodos([...todos, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

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
    setValidationErrors({});
    setIsEditing(false);
    setCurrentTodo(null);
  };

  const handleEdit = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setFormData(todo);
    setValidationErrors({});
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Search className="w-6 h-6 text-gray-400" />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Todo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {validationErrors.title}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content">Content</Label>
              <div className="col-span-3">
                <Input
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={validationErrors.content ? "border-red-500" : ""}
                />
                {validationErrors.content && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {validationErrors.content}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Status</Label>
              <RadioGroup
                className="col-span-3"
                value={formData.public}
                onValueChange={handlePublicChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Foods</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="food_orange"
                    name="food_orange"
                    checked={formData.food_orange}
                    onCheckedChange={(checked) => handleInputChange({ target: { name: 'food_orange', checked, type: 'checkbox' } })}
                  />
                  <Label htmlFor="food_orange">Orange</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="food_apple"
                    name="food_apple"
                    checked={formData.food_apple}
                    onCheckedChange={(checked) => handleInputChange({ target: { name: 'food_apple', checked, type: 'checkbox' } })}
                  />
                  <Label htmlFor="food_apple">Apple</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="food_banana"
                    name="food_banana"
                    checked={formData.food_banana}
                    onCheckedChange={(checked) => handleInputChange({ target: { name: 'food_banana', checked, type: 'checkbox' } })}
                  />
                  <Label htmlFor="food_banana">Banana</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pub_date">Date</Label>
              <Input
                id="pub_date"
                name="pub_date"
                type="date"
                value={formData.pub_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Quantities</Label>
              <div className="col-span-3 space-y-2">
                <div>
                  <Input
                    name="qty1"
                    type="text"
                    placeholder="Quantity 1"
                    value={formData.qty1}
                    onChange={handleInputChange}
                    className={validationErrors.qty1 ? "border-red-500" : ""}
                  />
                  {validationErrors.qty1 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {validationErrors.qty1}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <Input
                    name="qty2"
                    type="text"
                    placeholder="Quantity 2"
                    value={formData.qty2}
                    onChange={handleInputChange}
                    className={validationErrors.qty2 ? "border-red-500" : ""}
                  />
                  {validationErrors.qty2 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {validationErrors.qty2}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <Input
                    name="qty3"
                    type="text"
                    placeholder="Quantity 3"
                    value={formData.qty3}
                    onChange={handleInputChange}
                    className={validationErrors.qty3 ? "border-red-500" : ""}
                  />
                  {validationErrors.qty3 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {validationErrors.qty3}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <div key={todo.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-600">{todo.content}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(todo)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(todo.id)}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Status: {todo.public}</p>
              <p>Date: {todo.pub_date}</p>
              <p>Foods: {[
                todo.food_orange && 'Orange',
                todo.food_apple && 'Apple',
                todo.food_banana && 'Banana'
              ].filter(Boolean).join(', ')}</p>
              <p>Quantities: {[todo.qty1, todo.qty2, todo.qty3].filter(Boolean).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
