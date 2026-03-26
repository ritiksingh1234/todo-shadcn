import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoApp from "./TodoApp.jsx";
import AddTodoPage from "./AddTodoPage.jsx";
import { NotificationProvider } from "./context/NotificationManager.tsx";
import { ToastProvider } from "@/components/ui/toast";

function App() {
  return (
    <NotificationProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<TodoApp />} />
            <Route path="/add" element={<AddTodoPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </NotificationProvider>
  );
}

export default App;
