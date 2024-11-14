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
import TodoForm from './Mermaid/TodoForm';
import CrudIndex from './Mermaid/CrudIndex';

// zodスキーマの定義
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
});

type TodoSchema = z.infer<typeof todoSchema>;

interface Todo extends TodoSchema {
  id: number;
}

interface ValidationErrors {
  [key: string]: string[];
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<TodoSchema>({
    title: '',
    content: '',
  });
  //
  useEffect(() => {
    (async() => {
      const d = await CrudIndex.getList();
      setTodos(d);
      console.log(d);
    })()
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
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
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (currentTodo) {
      console.log("id=", currentTodo.id);
      //console.log(formData);
      let resulte = await CrudIndex.update(formData, Number(currentTodo.id) );
      console.log(resulte)
      setTodos(todos.map(todo => 
        todo.id === currentTodo.id ? { ...formData, id: todo.id } : todo
      ));
    } else {
      console.log(formData);
      let resulte = await CrudIndex.create(formData);
      console.log(resulte);
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

  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      let resulte = await CrudIndex.delete(id);
      console.log(resulte);
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
        <h1 className="text-2xl font-bold">Mermaid App</h1>
        <TodoForm 
        handleSubmit={handleSubmit}
        currentTodo={currentTodo}
        formData={formData}
        setFormData={setFormData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        resetForm={resetForm}
        errors={errors}
        ErrorMessage={ErrorMessage}
        />
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
                {/*
                <p className="text-sm text-gray-600">{todo.content}</p>
                */}
              </div>
              <div className="flex gap-2">
                <a href={`/mermaidshow/${todo.id}`}>
                  <Button variant="outline">
                    Show
                  </Button>
                </a>
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
