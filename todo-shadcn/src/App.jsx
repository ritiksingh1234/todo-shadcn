import TodoApp from "./TodoApp.jsx";
import { NotificationProvider } from "./context/NotificationManager.tsx";

function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-4">
        <TodoApp />
      </div>
    </NotificationProvider>
  );
}

export default App;
