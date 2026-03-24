import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Search, X } from 'lucide-react'
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
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;
  const { toast } = useToast();
  const { showBrowserNotification, permission, requestPermission } = useNotificationContext();
  const [notification, setNotification] = useState({ message: '', variant: 'success' });

  // Load todos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    } else {
      const sampleTodos = [
        { id: 1, text: 'Learn React Hooks', completed: false },
        { id: 2, text: 'Build todo app', completed: true },
        { id: 3, text: 'Deploy to Vercel', completed: false },
        { id: 4, text: 'Write tests', completed: false },
        { id: 5, text: 'Add pagination', completed: true },
        { id: 6, text: 'Implement bulk delete', completed: false }
      ];
      setTodos(sampleTodos);
      localStorage.setItem('todos', JSON.stringify(sampleTodos));
    }
  }, []);

// Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalTodos = todos.length;

  const completedCount = filteredTodos.filter((t) => t.completed).length;
  const totalFiltered = filteredTodos.length;



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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/5 backdrop-blur-xl">
        {/* Header */}
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            My Todos
          </CardTitle>
          <div className="flex gap-2 justify-center items-center mt-2 flex-wrap">
              <Badge variant="secondary" className="bg-purple-500/20 border-purple-500/50 text-purple-200">
              {totalTodos} total
            </Badge>
            <Badge variant={completedCount === totalFiltered ? "default" : "secondary"} className="bg-emerald-500/20 border-emerald-500/50 text-emerald-200">
              {completedCount} done
            </Badge>
            <Link to="/add" className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white px-3 py-1 rounded-md font-medium transition-all">
              ➕ New Todo
            </Link>
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
            <Button onClick={addTodo} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>

        {/* Search */}
        <CardContent className="pb-6">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500 focus-visible:ring-2"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch('')}
              >
                {search ? <X className="h-3 w-3" /> : <Search className="h-3 w-3" />}
              </Button>
            </div>
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
        <CardContent className="p-6 overflow-y-auto">
          <DataTable
            todos={currentTodos}
            selectedIds={selectedIds.filter(id => currentTodos.some(todo => todo.id === id))}
            editingId={editingId}
            editText={editText}
            onToggle={toggleTodo}
            onSelectToggle={handleSelectToggle}
            onEditStart={startEdit}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onDelete={showDeleteDialog}
            setEditText={setEditText}
            currentPage={currentPage}
            totalPages={totalPages}
            todosPerPage={todosPerPage}
            onPageChange={setCurrentPage}
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

