import { useState, useMemo , useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';

import CrudIndex from './cms/CrudIndex'
import Head from '../components/Head';

interface Article {
  id: number;
  title: string;
  content: string;
}
//
function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async() => {
      const d = await CrudIndex.getList();
      setArticles(d);
      console.log(d);
    })()
  }, []);
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      let target = articles.filter((article) => article.id === editingId);
      //console.log(target);
      if(target.length > 0){
        target = target[0];
        target.title = title;
        target.content = content;
        let resulte = await CrudIndex.update(target);
        console.log(resulte);
        setArticles(resulte);
      } 

      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(), title: title, content: content 
      };
console.log(newEntry);
      let resulte = await CrudIndex.create(newEntry);
      //console.log(resulte);
      setArticles(resulte);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditingId(article.id);
  };

  const handleDelete = async(id: number) => {
    let resulte = await CrudIndex.delete(id);
    console.log(resulte);
    setArticles(articles.filter(article => article.id !== id));
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  return (
  <>
    <Head />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CMS Article Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId !== null ? 'Edit Article' : 'Add New Article'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Tabs defaultValue="edit" className="w-full">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    placeholder="Article Content (Markdown supported)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={10}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit">
                {editingId !== null ? 'Update Article' : 'Add Article'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Article List</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {filteredArticles.map(article => (
                <div key={article.id} className="mb-4 p-4 border rounded">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 mb-2">
                    <ReactMarkdown>
                      {article.content.length > 150
                        ? `${article.content.slice(0, 150)}...`
                        : article.content}
                    </ReactMarkdown>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                      if (window.confirm("Delete OK?")) {
                        handleDelete(article.id)
                      }
                    }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  </>
  );
}

export default App;