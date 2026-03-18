# Todo App - React + shadcn/ui + Vite

Fully functional To-Do App with CRUD operations, localStorage persistence, and beautiful glassmorphism design.

![Todo App Screenshot](https://via.placeholder.com/1200x800/1e1b4b/ffffff?text=Todo+App+Screenshot)

## ✨ Features
- ✅ **Add** tasks (type + Enter or Add button)
- ✅ **Toggle Complete** (checkbox - strikethrough + status badge updates)
- ✅ **Edit** inline (click task → edit → Save/Cancel or Enter/Esc)
- ✅ **Delete** with confirmation dialog
- 💾 **Persists** via localStorage (survives refresh)
- 📊 **Stats** badges (total / completed count)
- 🎨 **shadcn/ui** components + Tailwind glassmorphism styling
- 📱 Responsive design

## 🚀 Quick Start
```bash
cd todo-shadcn
npm install  # if needed
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

**Default view:** Advanced TodoApp (table-based) with full CRUD.

## 🗂️ Project Structure
```
src/
├── App.jsx                 # Main layout
├── TodoApp.jsx             # Advanced todo app w/ DataTable
├── components/
│   └── DataTable.tsx       # shadcn table renderer
└── components/ui/          # shadcn components
```

## 🧪 Testing Features
1. Add tasks via input
2. Toggle checkbox → see strikethrough + 'Done' badge
3. Click task text to edit → Save/Cancel
4. Delete → confirm dialog
5. Refresh page → data persists

## 🔧 Tech Stack
- React 18 + Vite
- TypeScript
- shadcn/ui + Tailwind CSS
- lucide-react icons
- localStorage

## 📝 License
MIT
