import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface Todo {
  id: number;
  text: string;
}

export default function TodoTable() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState(""); // new for inline input

  useEffect(() => {
    const saved = localStorage.getItem('todotable-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todotable-todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editingId === null || !editText.trim()) return;
    setTodos(todos.map((todo) =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-8 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Todo Table CRUD
          </h1>

          {/* Add Task */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500"
            />
            <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8">
              Add Task
            </Button>
          </div>

          {/* Todo Table */}
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No tasks yet. Add one above!
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border bg-background/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todos.map((todo, index) => (
                    <TableRow key={todo.id} className="hover:bg-white/10">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      {editingId === todo.id ? (
                        <>
                          <TableCell className="font-medium">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit();
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus-visible:ring-purple-500 h-9"
                              autoFocus
                            />
                          </TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleSaveEdit}
                              className="h-9 border-white/30 bg-green-500/80 hover:bg-green-600 text-white"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="h-9 border-white/30 bg-white/10 hover:bg-white/20 text-white"
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{todo.text}</TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStart(todo)}
                              className="h-9 border-white/30 bg-white/10 hover:bg-white/20 text-white"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(todo.id)}
                              className="h-9 bg-destructive/80 hover:bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
