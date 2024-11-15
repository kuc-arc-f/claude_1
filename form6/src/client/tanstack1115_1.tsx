import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { z } from 'zod';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

// Zodスキーマの定義
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.string(),
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

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    public: 'private',
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
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              タイトル
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'content',
        header: 'コンテンツ',
      },
      {
        accessorKey: 'public',
        header: '公開設定',
        cell: ({ row }) => (row.original.public === 'public' ? '公開' : '非公開'),
      },
      {
        accessorKey: 'fruits',
        header: 'フルーツ',
        cell: ({ row }) => {
          const fruits = ['orange', 'apple', 'banana', 'melon', 'grape']
            .filter(fruit => row.original[`food_${fruit}`])
            .join(', ');
          return fruits || '-';
        },
      },
      {
        accessorKey: 'actions',
        header: 'アクション',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(row.index)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(row.index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  const validateForm = () => {
    try {
      todoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (editingTodo !== null) {
        setTodos(todos.map((todo, index) => 
          index === editingTodo ? formData : todo
        ));
      } else {
        setTodos([...todos, formData]);
      }
      resetForm();
      setIsOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      public: 'private',
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
    });
    setErrors({});
    setEditingTodo(null);
  };

  const handleEdit = (index) => {
    setEditingTodo(index);
    setFormData(todos[index]);
    setIsOpen(true);
  };

  const handleDelete = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const renderError = (field) => {
    if (errors[field]) {
      return (
        <Alert variant="destructive" className="mt-1">
          <AlertDescription>{errors[field]}</AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="検索..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
          <Search className="text-gray-500" />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              新規TODO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTodo !== null ? 'TODO編集' : '新規TODO作成'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "border-red-500" : ""}
                />
                {renderError('title')}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={errors.content ? "border-red-500" : ""}
                />
                {renderError('content')}
              </div>
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label>フルーツ選択</Label>
                <div className="flex flex-wrap gap-4">
                  {['orange', 'apple', 'banana', 'melon', 'grape'].map((fruit) => (
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
              </div>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`pub_date${num}`}>日付 {num}</Label>
                    <Input
                      type="date"
                      id={`pub_date${num}`}
                      name={`pub_date${num}`}
                      value={formData[`pub_date${num}`]}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`qty${num}`}>数量 {num}</Label>
                    <Input
                      type="text"
                      id={`qty${num}`}
                      name={`qty${num}`}
                      value={formData[`qty${num}`]}
                      onChange={handleInputChange}
                      className={errors[`qty${num}`] ? "border-red-500" : ""}
                    />
                    {renderError(`qty${num}`)}
                  </div>
                </div>
              ))}
              <Button onClick={handleSubmit}>
                {editingTodo !== null ? '更新' : '作成'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  データがありません。
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
