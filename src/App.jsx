import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TodoList from "./components/TodoList";
import InputField from "./components/InputField";
import { addNewTodo, fetchTodos } from "./store/todoSlice";

function App() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(addNewTodo(title));
    setTitle("");
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="App">
      <h1>Redux toolkit</h1>
      <InputField title={title} setTitle={setTitle} addTodo={addTask} />

      <div className="todoListBlock">
        <h2>Todo list</h2>
        <TodoList />
      </div>
    </div>
  );
}

export default App;
