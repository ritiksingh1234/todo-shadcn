import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { useNotificationContext } from '@/context/NotificationManager.tsx'
import {
  DataTable
} from '@/components/DataTable'
import { Toaster } from '@/components/ui/toaster'

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
const [deleteDialogId, setDeleteDialogId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const { showBrowserNotification, permission, requestPermission } = useNotificationContext();
  const [notification, setNotification] = useState({ message: '', variant: 'success' });

  // Load todos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const showMessage = (msg, variant = 'success') => {
    setNotification({ message: msg, variant });
    setTimeout(() => setNotification({ message: '', variant: 'success' }), 3000);
  };

const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos, 
        { 
          id: Date.now(), 
          text: newTodo.trim(), 
          completed: false 
        }
      ]);
      setNewTodo('');
      toast({
        title: "Task added successfully!",
      });
      showBrowserNotification('Task Added!', { body: newTodo });
      showMessage('✅ Task Added!');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed } 
        : todo
    ));
    const todo = todos.find(t => t.id === id);
    const status = todo?.completed ? 'pending' : 'done';
    toast({
      title: todo?.completed ? "Task marked pending!" : "Task marked done!",
    });
    showBrowserNotification(`Task marked ${status}!`, { body: todo?.text });
    showMessage(todo?.completed ? '📋 Task marked pending!' : '✔️ Task marked done!');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setDeleteDialogId(null);
    toast({
      title: "Task deleted.",
      variant: "destructive"
    });
    showBrowserNotification('Task Deleted!', { body: 'Check your todo list.' });
    showMessage('🗑️ Task Deleted!', 'destructive');
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingId 
          ? { ...todo, text: editText.trim() } 
          : todo
      ));
    toast({
      title: "Task updated!",
    });
    showBrowserNotification('Task Updated!', { body: editText });
    showMessage('✏️ Task Updated!');
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const showDeleteDialog = (id) => {
    setDeleteDialogId(id);
  };

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const deleteSelected = () => {
    setTodos(todos.filter((todo) => !selectedIds.includes(todo.id)));
    setSelectedIds([]);
    toast({
      title: "Tasks Deleted",
      variant: "destructive"
    });
    showBrowserNotification(`${selectedIds.length} Tasks Deleted!`);
    showMessage(`🗑️ ${selectedIds.length} Tasks Deleted!`, 'destructive');
  };

  const markDoneSelected = () => {
    setTodos(
      todos.map((todo) =>
        selectedIds.includes(todo.id) ? { ...todo, completed: true } : todo
      )
    );
    setSelectedIds([]);
    toast({
      title: "Tasks Marked Done",
      variant: "success"
    });
    showBrowserNotification(`${selectedIds.length} Tasks Marked Done!`);
    showMessage(`✔️ ${selectedIds.length} Tasks Marked Done!`);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = filteredTodos.filter((t) => t.completed).length;
  const totalCount = filteredTodos.length;
  const uncompleted = filteredTodos.filter((t) => !t.completed);
  const completed = filteredTodos.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/5 backdrop-blur-xl">
        {/* Header */}
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            My Todos
          </CardTitle>
          <div className="flex gap-2 justify-center items-center mt-2">
            <Badge variant="secondary" className="bg-purple-500/20 border-purple-500/50 text-purple-200">
              {totalCount} total
            </Badge>
            <Badge variant={completedCount === totalCount ? "default" : "secondary"} className="bg-emerald-500/20 border-emerald-500/50 text-emerald-200">
              {completedCount} done
            </Badge>
            {permission !== 'granted' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => requestPermission()}
                className="text-xs border-purple-500/50 hover:bg-purple-500/10"
              >
                🔔 Enable Notifications
              </Button>
            )}
          </div>
        </CardHeader>

        {notification.message && (
          <CardContent className="p-4">
            <div className={`p-4 rounded-lg text-white font-medium text-center transition-all duration-300 ${
              notification.variant === 'success' 
                ? 'bg-green-500/90 backdrop-blur-sm border border-green-400/50' 
                : 'bg-red-500/90 backdrop-blur-sm border border-red-400/50'
            }`}>
              {notification.message}
            </div>
          </CardContent>
        )}

        {/* Input */}
        <CardContent className="pb-4">
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new todo..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500 focus-visible:ring-2"
            />
            <Button onClick={addTodo} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8">
              Add
            </Button>
          </div>
        </CardContent>

        {/* Search */}
        <CardContent className="pb-6">
          <div className="flex gap-2 items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500 focus-visible:ring-2"
            />
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={deleteSelected}
                  variant="destructive"
                  size="sm"
                  className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"
                >
                  Delete Selected ({selectedIds.length})
                </Button>
                <Button
                  onClick={markDoneSelected}
                  variant="default"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  Mark Done ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        {/* Todos Table */}
        <CardContent className="p-6 max-h-96 overflow-hidden">
          <DataTable
            todos={filteredTodos}
            selectedIds={selectedIds}
            editingId={editingId}
            editText={editText}
            onToggle={toggleTodo}
            onSelectToggle={handleSelectToggle}
            onEditStart={startEdit}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onDelete={showDeleteDialog}
            setEditText={setEditText}
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogId !== null} onOpenChange={() => setDeleteDialogId(null)}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Delete Todo?</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this todo? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={() => deleteTodo(deleteDialogId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}



export default TodoApp;
