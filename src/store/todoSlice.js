import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = "https://jsonplaceholder.typicode.com/todos";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(baseUrl + '?_limit=10');

      if (!response.ok) {
        throw new Error("server error");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeTodo = createAsyncThunk(
  "todos/removeTodo",
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(baseUrl + "/" + id, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("can't delete task. server error");
      }
      dispatch(delTodo({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async function (id, { rejectWithValue, dispatch, getState }) {
    const todo = getState().todos.todos.find((todo) => todo.id === id);

    try {
      const response = await fetch(baseUrl + "/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error("can't update task status. server error");
      }

      dispatch(toggleTodoCompleted({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async function (title, { rejectWithValue, dispatch }) {
    const todo = { userId: 1, title: title, completed: false };

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error("can't create task. server error");
      }

      const data = await response.json()

      dispatch(addTodo(data));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {


      state.todos.push(
    //     {
    //     id: new Date().toISOString(),
    //     title: action.payload.title,
    //     completed: false,
    //   }
    action.payload
      );
    },
    delTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    toggleTodoCompleted(state, action) {
      const toggleTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggleTodo.completed = !toggleTodo.completed;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.status = "loading";
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.todos = action.payload;
    },
    [fetchTodos.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.payload;
      console.error(action.payload);
    },
  },
});

export const { addTodo, delTodo, toggleTodoCompleted } = todoSlice.actions;
export default todoSlice.reducer;
