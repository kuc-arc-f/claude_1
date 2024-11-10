import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
//
import Head from '../components/Head';
import CrudIndex from './todo/CrudIndex'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [todoText, setTodoText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  //
  useEffect(() => {
    (async() => {
      const d = await CrudIndex.getList();
      setTodos(d);
      console.log(d);
    })()
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todos, searchQuery]);

  const openDialog = (todo?: Todo) => {
    if (todo) {
      setCurrentTodo(todo);
      setTodoText(todo.text);
    } else {
      setCurrentTodo(null);
      setTodoText('');
    }
    setDialogOpen(true);
  };

  const saveTodo = async() => {
    if (todoText.trim() !== '') {
      if (currentTodo) {
        // Edit existing todo
        let target = todos.filter((todo) => todo.id === currentTodo.id);
        //console.log(target);
        if(target.length > 0){
          target = target[0];
          target.text = todoText;
          let resulte = await CrudIndex.update(target);
          console.log(resulte);
          setTodos(resulte);
        }        
        //setTodos(todos.map(todo =>
        //  todo.id === currentTodo.id ? { ...todo, text: todoText } : todo
        //));
        toast({
          title: "タスクを更新しました",
          description: todoText,
        });
      } else {
        const newEntry = {
          id: Date.now(), text: todoText, completed: false 
        };
console.log(newEntry);
        let resulte = await CrudIndex.create(newEntry);
        console.log(resulte);
        // Add new todo
        setTodos(resulte);
        toast({
          title: "タスクを追加しました",
          description: todoText,
        });
      }
      setDialogOpen(false);
      setTodoText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = async(id: number) => {
    let resulte = await CrudIndex.delete(id);
    console.log(resulte);
    setTodos(resulte);
    //setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "タスクを削除しました",
      variant: "destructive",
    });
  };

  return (
    <>
      <Head />
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>TODOアプリ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => openDialog()}>新しいタスク</Button>
          </div>
          <ScrollArea className="h-[300px]">
            {filteredTodos.map(todo => (
              <div key={todo.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span className={`flex-grow text-left ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
                <Button variant="ghost" size="icon" onClick={() => openDialog(todo)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  if (window.confirm("Delete OK?")) {
                    deleteTodo(todo.id);
                  }
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTodo ? 'タスクを編集' : '新しいタスク'}</DialogTitle>
          </DialogHeader>
          <Input
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="タスクを入力..."
          />
          <DialogFooter>
            <Button onClick={saveTodo}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;