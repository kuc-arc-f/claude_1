import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Pencil, Trash2, ArrowUpDown } from 'lucide-react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sorting, setSorting] = useState({ field: 'createdAt', direction: 'desc' });
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
  
  // 新規TODOの追加
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo,
        createdAt: new Date().toISOString(),
        status: '未完了'
      }]);
      setNewTodo('');
      setIsAddDialogOpen(false);
    }
  };

  // TODOの編集
  const handleEditTodo = () => {
    if (editingTodo.text.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? editingTodo : todo
      ));
      setIsEditDialogOpen(false);
    }
  };

  // TODOの削除
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // ステータスの切り替え
  const handleToggleStatus = (todo) => {
    const newStatus = todo.status === '完了' ? '未完了' : '完了';
    setTodos(todos.map(t => 
      t.id === todo.id ? { ...t, status: newStatus } : t
    ));
  };

  // ソート機能の実装
  const handleSort = (field) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // フィルタリングとソートを適用したTODOリスト
  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const direction = sorting.direction === 'asc' ? 1 : -1;
        if (sorting.field === 'createdAt') {
          return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
        }
        return (a[sorting.field] > b[sorting.field] ? 1 : -1) * direction;
      });
  }, [todos, searchTerm, sorting]);

  // テーブルの列定義
  const columns = [
    {
      header: 'TODO',
      accessorKey: 'text',
    },
    {
      header: '作成日時',
      accessorKey: 'createdAt',
      cell: (props) => new Date(props.value).toLocaleString(),
    },
    {
      header: 'ステータス',
      accessorKey: 'status',
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TODO アプリ</h1>
      
      {/* 検索バー */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="TODOを検索..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 追加ボタンとダイアログ */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>新規TODO追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規TODOの追加</DialogTitle>
            </DialogHeader>
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="新規TODOを入力..."
            />
            <DialogFooter>
              <Button onClick={handleAddTodo}>追加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODOの編集</DialogTitle>
          </DialogHeader>
          <Input
            value={editingTodo?.text || ''}
            onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
            placeholder="TODOを編集..."
          />
          <DialogFooter>
            <Button onClick={handleEditTodo}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TODOテーブル */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.accessorKey}
                  className="cursor-pointer"
                  onClick={() => handleSort(column.accessorKey)}
                >
                  <div className="flex items-center">
                    {column.header}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              ))}
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTodos.map(todo => (
              <TableRow key={todo.id}>
                <TableCell>{todo.text}</TableCell>
                <TableCell>{new Date(todo.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleStatus(todo)}
                    className={todo.status === '完了' ? 'text-green-600' : ''}
                  >
                    {todo.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTodo(todo);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TodoApp;
