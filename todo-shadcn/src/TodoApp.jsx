import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'
import {
  DataTable
} from '@/components/DataTable'

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteDialogId, setDeleteDialogId] = useState(null);

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
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed } 
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setDeleteDialogId(null);
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

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const uncompleted = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

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
          </div>
        </CardHeader>

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

        {/* Todos Table */}
        <CardContent className="p-6 max-h-96 overflow-hidden">
          <DataTable
            todos={todos}
            editingId={editingId}
            editText={editText}
            onToggle={toggleTodo}
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
    </div>
  );
}



export default TodoApp;
