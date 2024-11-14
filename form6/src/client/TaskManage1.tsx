import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
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
  };

  const handleSubmit = () => {
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

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData(todo);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(todo.id)}>
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
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="content">内容</Label>
              <Input
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>
            <div>
              <Label>ステータス</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
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
                onChange={(e) => setFormData({...formData, task_start: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="task_end">終了日</Label>
              <Input
                id="task_end"
                type="date"
                value={formData.task_end}
                onChange={(e) => setFormData({...formData, task_end: e.target.value})}
              />
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
