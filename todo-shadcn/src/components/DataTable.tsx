import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface DataTableProps {
  todos: Todo[]
  editingId: number | null
  editText: string
  onToggle: (id: number) => void
  onEditStart: (id: number, text: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: (id: number) => void
  setEditText: (text: string) => void
}

export function DataTable({
  todos,
  editingId,
  editText,
  onToggle,
  onEditStart,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  setEditText
}: DataTableProps) {
  return (
    <div className="rounded-md border bg-background/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Done</TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell className="font-medium">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {editingId === todo.id ? (
                  <div className="flex gap-1">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onSaveEdit()
                        if (e.key === 'Escape') onCancelEdit()
                      }}
                      autoFocus
                      className="h-8"
                    />
                  </div>
                ) : (
                  <span
                    className={`cursor-pointer hover:underline ${
                      todo.completed
                        ? 'line-through text-muted-foreground'
                        : ''
                    }`}
                    onClick={() => onEditStart(todo.id, todo.text)}
                  >
                    {todo.text}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={todo.completed ? 'default' : 'secondary'}>
                  {todo.completed ? 'Done' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-1">
                {editingId === todo.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onSaveEdit}
                      className="h-8 w-8 p-0"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onCancelEdit}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      ✕
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(todo.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20"
                  >
                    🗑️
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {todos.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No todos yet. Add one above!
        </div>
      )}
    </div>
  )
}

