import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoApp from "./TodoApp.jsx";
import AddTodoPage from "./AddTodoPage.jsx";
import { NotificationProvider } from "./context/NotificationManager.tsx";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="/add" element={<AddTodoPage />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
