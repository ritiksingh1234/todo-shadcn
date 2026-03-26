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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowUp, ArrowDown } from 'lucide-react'



interface Todo {
  id: number
  text: string
  completed: boolean
}

interface DataTableProps {
  todos: Todo[]
  selectedIds: number[]
  onSelectToggle: (id: number) => void
  editingId: number | null
  editText: string
  onToggle: (id: number) => void
  onEditStart: (id: number, text: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: (id: number) => void
  setEditText: (text: string) => void
  currentPage: number
  totalPages: number
  todosPerPage: number
  totalTodos: number
  onPageChange: (page: number) => void
  sortBy: string | null
  sortDir: string
  onSort: (by: string) => void
}

export function DataTable({
  todos,
  selectedIds,
  onSelectToggle,
  editingId,
  editText,
  onToggle,
  onEditStart,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  setEditText,
  currentPage,
  totalPages,
  todosPerPage,
  totalTodos,
  onPageChange,
  sortBy,
  sortDir,
  onSort
}: DataTableProps) {
  const allSelected = todos.length > 0 && todos.every(todo => selectedIds.includes(todo.id));
  const isIndeterminate = todos.some(todo => selectedIds.includes(todo.id)) && !allSelected;
  const selectAllChecked = allSelected ? true : isIndeterminate ? 'indeterminate' : false;

  const handleSelectAll = () => {
    if (allSelected) {
      todos.forEach(todo => {
        if (selectedIds.includes(todo.id)) onSelectToggle(todo.id);
      });
    } else {
      todos.forEach(todo => {
        if (!selectedIds.includes(todo.id)) {
          onSelectToggle(todo.id);
        }
      });
    }
  };

  return (
    <div className="rounded-md border bg-background/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectAllChecked}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[50px]">Done</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-accent/50 select-none"
              onClick={() => onSort('task')}
            >
              <div className="flex items-center gap-1">
                Task
                {sortBy === 'task' && (
                  sortDir === 'asc' 
                    ? <ArrowUp className="h-4 w-4" />
                    : <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="w-[120px] cursor-pointer hover:bg-accent/50 select-none"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                {sortBy === 'status' && (
                  sortDir === 'asc' 
                    ? <ArrowUp className="h-4 w-4" />
                    : <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell className="font-medium">
                <Checkbox
                  checked={selectedIds.includes(todo.id)}
                  onCheckedChange={() => onSelectToggle(todo.id)}
                />
              </TableCell>
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
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditStart(todo.id, todo.text)}
                      className="h-8 w-8 p-0 hover:bg-accent text-foreground hover:text-foreground"
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(todo.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20"
                    >
                      🗑️
                    </Button>
                  </>
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

      {totalPages > 1 && (
        <Pagination className="mt-4 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                text="← Back"
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="flex h-9 items-center justify-center px-4 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                text="Next →"
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
