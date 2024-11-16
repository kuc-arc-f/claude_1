import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Zodスキーマの定義
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容は必須項目です"),
  form_type: z.string().min(1, "フォームタイプは必須項目です"),
  qty1: z.string().min(1, "数量1は必須項目です"),
  qty2: z.string().min(1, "数量2は必須項目です"),
  qty3: z.string().min(1, "数量3は必須項目です"),
  public: z.string(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  food_melon: z.boolean(),
  food_grape: z.boolean(),
  date_publish: z.string(),
  date_update1: z.string(),
  date_update2: z.string(),
  date_update3: z.string(),
  option_text_1: z.string(),
  option_text_2: z.string(),
  option_text_3: z.string(),
  category_ict: z.boolean(),
  category_sport: z.boolean(),
  category_food: z.boolean(),
  category_drink: z.boolean(),
});

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [errors, setErrors] = useState({});
  const [sorting, setSorting] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    form_type: '',
    public: 'public',
    food_orange: false,
    food_apple: false,
    food_banana: false,
    food_melon: false,
    food_grape: false,
    date_publish: '',
    date_update1: '',
    date_update2: '',
    date_update3: '',
    option_text_1: '',
    option_text_2: '',
    option_text_3: '',
    category_ict: false,
    category_sport: false,
    category_food: false,
    category_drink: false,
    qty1: '',
    qty2: '',
    qty3: ''
  });

  // テーブルのカラム定義
  const columns = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          タイトル
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'content',
      header: 'コンテンツ',
    },
    {
      accessorKey: 'form_type',
      header: 'フォームタイプ',
    },
    {
      accessorKey: 'public',
      header: '公開設定',
      cell: ({ row }) => (
        <span>{row.original.public === 'public' ? '公開' : '非公開'}</span>
      ),
    },
    {
      accessorKey: 'date_publish',
      header: '公開日',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
            編集
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleDelete(row.original.id)}
          >
            削除
          </Button>
        </div>
      ),
    },
  ];
  
  // テーブルの設定
  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // 入力時にエラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      todoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      form_type: '',
      public: 'public',
      food_orange: false,
      food_apple: false,
      food_banana: false,
      food_melon: false,
      food_grape: false,
      date_publish: '',
      date_update1: '',
      date_update2: '',
      date_update3: '',
      option_text_1: '',
      option_text_2: '',
      option_text_3: '',
      category_ict: false,
      category_sport: false,
      category_food: false,
      category_drink: false,
      qty1: '',
      qty2: '',
      qty3: ''
    });
    setErrors({});
    setIsEditing(false);
    setCurrentTodo(null);
  };

  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setFormData(todo);
    setIsEditing(true);
    setErrors({});
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 space-y-4">
        {/* Dialog */}
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>新規TODO追加</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'TODO編集' : '新規TODO追加'}</DialogTitle>
              </DialogHeader>
              {/* フォーム部分は以前と同じ */}
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
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="content">内容</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className={errors.content ? "border-red-500" : ""}
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                <div>
                  <Label htmlFor="form_type">フォームタイプ</Label>
                  <Input
                    id="form_type"
                    name="form_type"
                    value={formData.form_type}
                    onChange={handleInputChange}
                    className={errors.form_type ? "border-red-500" : ""}
                  />
                  {errors.form_type && <p className="text-red-500 text-sm mt-1">{errors.form_type}</p>}
                </div>

                <div>
                  <Label>公開設定</Label>
                  <RadioGroup
                    name="public"
                    value={formData.public}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, public: value }))}
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
                  <Label>フルーツ</Label>
                  {['orange', 'apple', 'banana', 'melon', 'grape'].map(fruit => (
                    <div key={fruit} className="flex items-center space-x-2">
                      <Checkbox
                        id={`food_${fruit}`}
                        name={`food_${fruit}`}
                        checked={formData[`food_${fruit}`]}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, [`food_${fruit}`]: checked }))
                        }
                      />
                      <Label htmlFor={`food_${fruit}`}>{fruit}</Label>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_publish">公開日</Label>
                    <Input
                      type="date"
                      id="date_publish"
                      name="date_publish"
                      value={formData.date_publish}
                      onChange={handleInputChange}
                    />
                  </div>
                  {[1, 2, 3].map(num => (
                    <div key={num}>
                      <Label htmlFor={`date_update${num}`}>更新日{num}</Label>
                      <Input
                        type="date"
                        id={`date_update${num}`}
                        name={`date_update${num}`}
                        value={formData[`date_update${num}`]}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map(num => (
                    <div key={num}>
                      <Label htmlFor={`option_text_${num}`}>オプションテキスト{num}</Label>
                      <Textarea
                        id={`option_text_${num}`}
                        name={`option_text_${num}`}
                        value={formData[`option_text_${num}`]}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>カテゴリー</Label>
                  {['ict', 'sport', 'food', 'drink'].map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category_${category}`}
                        name={`category_${category}`}
                        checked={formData[`category_${category}`]}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, [`category_${category}`]: checked }))
                        }
                      />
                      <Label htmlFor={`category_${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(num => (
                    <div key={num}>
                      <Label htmlFor={`qty${num}`}>数量{num}</Label>
                      <Input
                        type="text"
                        id={`qty${num}`}
                        name={`qty${num}`}
                        value={formData[`qty${num}`]}
                        onChange={handleInputChange}
                        className={errors[`qty${num}`] ? "border-red-500" : ""}
                      />
                      {errors[`qty${num}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`qty${num}`]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="submit">
                    {isEditing ? '更新' : '追加'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    キャンセル
                  </Button>
                </div>
              </form>

            </DialogContent>
          </Dialog>
          <Input
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Input
          type="text"
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2"
        />
        <Search className="text-gray-500" />
      </div>

      {/* table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>      

    </div>
  );
};

export default TodoApp;
