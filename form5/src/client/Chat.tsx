import { useState , useEffect } from 'react';
import { MessageCircle, Send, Reply, Trash} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
//
import Head from '../components/Head'
import CrudIndex from './chat/CrudIndex'
//
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}
//
function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  //
  useEffect(() => {
    (async() => {
      const d = await CrudIndex.getList();
      //data = d;
      setMessages(d);
      console.log(d);
    })()
  }, []);

  const handleSendMessage = async () => {
    try{
      if (inputMessage.trim() === '') {
        console.error("error, none-inputMessage");
        return false;
      }
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        parentId: replyingTo,
      };
      const resulte = await CrudIndex.create(newMessage);
      setMessages(resulte);
      setInputMessage('');
      
      // ボットの応答をシミュレート
      setTimeout(async() => {
        if(replyingTo){ 
          setReplyingTo(null)
          return; 
        }
        const botResponse: Message = {
          id: Date.now() + 1,
          text: 'こんにちは！どのようなご用件でしょうか？',
          sender: 'bot',
          parentId: null,
        };
        const resulte = await CrudIndex.create(botResponse);
        console.log(resulte);
        setMessages(resulte);
        //setReplyingTo(null);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = (messageId: number) => {
    setReplyingTo(messageId);
  };
  //
  const handleDelete = async (messageId: string) => {
    try{    
      const resulte = await CrudIndex.delete(messageId);
      const d = await CrudIndex.getList();
      setMessages(d);
    } catch (e) {
      console.error(e);
    }
  };


  const renderMessage = (message: Message) => (
    <Card key={message.id} className={`mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[80%]`}>
      {/* <div>{JSON.stringify(message)}</div> */}
      <div className={`p-3 rounded-lg ${
        message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      }`}>
        {message.text}
      </div>
      {!message.parentId? (
        <Button variant="ghost" size="sm" className="mt-1" onClick={() => handleReply(message.id)}>
          <Reply className="h-4 w-4 mr-1" /> 返信
        </Button>
      ) : null }
      <Button variant="ghost" size="sm" className="mt-1" onClick={() => {
        console.log("id=", message.id);
        if (window.confirm("Delete OK?")) {
          handleDelete(message.id);
        }
      }}>
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>

    </Card>
  );

  const renderThread = (parentMessage: Message) => {
    const replies = messages.filter(m => m.parentId === parentMessage.id);
console.log(replies);
    return (
      <div key={parentMessage.id} className="mb-6">
        {renderMessage(parentMessage)}
        {replies.length > 0 && (
          <div className="ml-8 border-l-2 border-gray-200 pl-4">
            {replies.map(renderMessage)}
          </div>
        )}
      </div>
    );
  };

  const topLevelMessages = messages.filter(m => !m.parentId);
  //
  return (
  <>
    <Head />
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageCircle className="mr-2" />
          チャットアプリ
        </h1>
      </header>
      {/* Input_area */}
      <div className="p-4 bg-background">
        {replyingTo && (
          <div className="text-sm text-muted-foreground mb-2 text-red-400">
            返信中: {messages.find(m => m.id === replyingTo)?.text}
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>[ キャンセル ]
            </Button>
          </div>
        )}
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="メッセージを入力..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* ScrollArea */}
      <ScrollArea className="flex-grow p-4">
        {topLevelMessages.map(renderThread)}
      </ScrollArea>

    </div>  
  </>

  );
}

export default App;