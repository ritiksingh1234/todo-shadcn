import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNotificationContext } from '@/context/NotificationManager.tsx';
import { Toaster } from '@/components/ui/toaster';

function AddTodoPage() {
  const [text, setText] = useState('');

  const { toast } = useToast();
  const { showBrowserNotification } = useNotificationContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false
    };
    todos.unshift(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));

    toast({
      title: "Task created successfully!",
      duration: 3000,
    });
    showBrowserNotification('Task Added!', { body: text });

    setText('');
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-8 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mb-4 bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Todos
          </Button>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            New Todo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter new task title..."
              className="text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-emerald-500 focus-visible:ring-2"
            />
            <Button 
              type="submit" 
              disabled={!text.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 h-12 text-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Task
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

export default AddTodoPage;

