import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'
import { Search, X, Plus } from 'lucide-react'
import { useNotificationContext } from '@/context/NotificationManager.tsx'
import {
  DataTable
} from '@/components/DataTable'

// Custom hook for managing todos with localStorage persistence
function useTodos() {
  const [todos, setTodos] = useState(() => {
    // Initialize from localStorage on first render
    try {
      const saved = localStorage.getItem('todos');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that it's an array
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    }
    return [];
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  const addTodo = useCallback((text) => {
    setTodos(prev => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim(),
        completed: false
      }
    ]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id, text) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, text: text.trim() }
        : todo
    ));
  }, []);

  const deleteMultiple = useCallback((ids) => {
    setTodos(prev => prev.filter(todo => !ids.includes(todo.id)));
  }, []);

  const markMultipleDone = useCallback((ids) => {
    setTodos(prev => prev.map(todo =>
      ids.includes(todo.id)
        ? { ...todo, completed: true }
        : todo
    ));
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    deleteMultiple,
    markMultipleDone
  };
}

function TodoApp() {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteDialogId, setDeleteDialogId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const { showBrowserNotification, permission, requestPermission } = useNotificationContext();
  const [notification, setNotification] = useState({ message: '', variant: 'success' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  // Use the custom hook for todos management
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, deleteMultiple, markMultipleDone } = useTodos();

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  const getComparator = useCallback((by, dir) => (a, b) => {
    if (by === 'task') {
      return dir === 'asc' ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text);
    }
    if (by === 'status') {
      const aVal = a.completed ? 1 : 0;
      const bVal = b.completed ? 1 : 0;
      return dir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  }, []);

  const sortedTodos = useMemo(() => {
    if (!sortBy) return filteredTodos;
    const arr = [...filteredTodos];
    arr.sort(getComparator(sortBy, sortDir));
    return arr;
  }, [filteredTodos, sortBy, sortDir, getComparator]);

  // Pagination constants and logic
  const shouldPaginate = todos.length > 5;
  const effectiveItemsPerPage = shouldPaginate ? ITEMS_PER_PAGE : sortedTodos.length;
  const totalPages = Math.ceil(sortedTodos.length / effectiveItemsPerPage);
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const currentTodos = sortedTodos.slice(startIndex, startIndex + effectiveItemsPerPage);

  // Reset page to 1 when todos or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [todos, search]);

  const totalTodos = todos.length;

  const completedCount = filteredTodos.filter((t) => t.completed).length;
  const totalFiltered = filteredTodos.length;

  const showMessage = (msg, variant = 'success') => {
    setNotification({ message: msg, variant });
    setTimeout(() => setNotification({ message: '', variant: 'success' }), 3000);
  };

  const handleToggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    toggleTodo(id);
    const status = todo?.completed ? 'pending' : 'done';
    showBrowserNotification(`Task marked ${status}!`, { body: todo?.text });
    showMessage(todo?.completed ? '📋 Task marked pending!' : '✔️ Task marked done!');
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id);
    setDeleteDialogId(null);
    showBrowserNotification('Task Deleted!', { body: 'Check your todo list.' });
    showMessage('🗑️ Task Deleted!', 'destructive');
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      updateTodo(editingId, editText);
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
    deleteMultiple(selectedIds);
    setSelectedIds([]);
    showBrowserNotification(`${selectedIds.length} Tasks Deleted!`);
    showMessage(`🗑️ ${selectedIds.length} Tasks Deleted!`, 'destructive');
  };

  const markDoneSelected = () => {
    markMultipleDone(selectedIds);
    setSelectedIds([]);
    showBrowserNotification(`${selectedIds.length} Tasks Marked Done!`);
    showMessage(`✔️ ${selectedIds.length} Tasks Marked Done!`);
  };

  const handleSort = (by) => {
    if (sortBy === by) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      setSortDir('asc');
    }
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
          <div className="flex justify-center items-center mt-3 gap-4">
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Todo
            </Button>
            {notification.message && (
              <span className="text-sm text-gray-300 animate-pulse whitespace-nowrap">
                {notification.message}
              </span>
            )}
          </div>
        </CardHeader>

        {/* Search and Sort */}
        <CardContent className="pb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative w-full max-w-md mx-auto">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Tasks..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500 focus-visible:ring-2 py-2 text-sm rounded-lg shadow-md"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 p-0 text-gray-600 hover:text-white transition-colors"
                onClick={() => setSearch('')}
              >
                {search ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            
          </div>
          
          {/* Selected Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <Button
                onClick={deleteSelected}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <span className="mr-1">🗑️</span>
                Delete
              </Button>
              <Button
                onClick={markDoneSelected}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <span className="mr-1">✅</span>
                Done
              </Button>
            </div>
          )}
        </CardContent>

        {/* Todos Table */}
        <CardContent className="p-6 overflow-y-auto">
          {totalFiltered === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📝</div>
              <p className="text-xl font-medium text-gray-300">No todos yet</p>
              <p className="text-sm mt-2 text-gray-500">Add your first task above to get started!</p>
            </div>
          ) : (
            <DataTable
              todos={currentTodos}
              selectedIds={selectedIds.filter(id => currentTodos.some(todo => todo.id === id))}
              editingId={editingId}
              editText={editText}
              onToggle={handleToggleTodo}
              onSelectToggle={handleSelectToggle}
              onEditStart={startEdit}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onDelete={showDeleteDialog}
              setEditText={setEditText}
              currentPage={currentPage}
              totalPages={totalPages}
              todosPerPage={effectiveItemsPerPage}
              totalTodos={totalFiltered}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )}
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
            <Button type="button" variant="destructive" onClick={() => handleDeleteTodo(deleteDialogId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Todo Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) setNewTodo('');
      }}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter the details for your new task.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTodo.trim()) {
                  addTodo(newTodo);
                  showBrowserNotification('Task Added!', { body: newTodo });
                  showMessage('✅ Task Added!');
                  setNewTodo('');
                  setIsAddDialogOpen(false);
                }
              }}
              placeholder="Enter task title..."
              autoFocus
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500 focus-visible:ring-2"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setNewTodo('');
            }}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                if (newTodo.trim()) {
                  addTodo(newTodo);
                  showBrowserNotification('Task Added!', { body: newTodo });
                  showMessage('✅ Task Added!');
                  setNewTodo('');
                  setIsAddDialogOpen(false);
                }
              }}
              disabled={!newTodo.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TodoApp;
