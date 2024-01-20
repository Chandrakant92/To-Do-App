import React from "react";
import { MdDelete } from "react-icons/md";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "react-query";
import axios from "axios";
import "./App.css";

const queryClient = new QueryClient();
const apiUrl = process.env.REACT_APP_API_URL;

const fetchTasks = async () => {
  const { data } = await axios.get("http://localhost:5000/api/task");
  return data;
};

const addTask = async (task: { title: string }) => {
  const { data } = await axios.post("http://localhost:5000/api/todos", task);
  return data;
};
const deleteTask = async (taskId: string) => {
  await axios.delete(`http://localhost:5000/api/todos/${taskId}`);
};

function App() {
  const { data: tasks, refetch } = useQuery("tasks", fetchTasks);
  const addMutation = useMutation(addTask);
  const delMutation = useMutation(deleteTask);

  const handleAddTask = async () => {
    const title = prompt("Enter task title:");
    if (title) {
      addMutation.mutate(
        { title },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // console.log(taskId);
    delMutation.mutate(taskId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <>
      <div className="container">
        <div>
          <h4>🙂 Empower Your Day with Ultimate Todo Mastery 🙂</h4>
          <div className="thought">
            {" "}
            <p>
              Every accomplishment starts with the decision to try. Embrace the
              power of your todo list and make each task a step toward success.
            </p>
          </div>
          <div className="task">
            <ul>
              {tasks?.map((task: any) => (
                <div className="taskList">
                  <div className="dot">👉</div>
                  <div className="tasks">
                    <li key={task._id} className="tasklist">
                      {task.title}
                    </li>
                  </div>
                  <div className="del-task">
                    <MdDelete onClick={() => handleDeleteTask(task._id)} />
                  </div>
                </div>
              ))}
            </ul>
          </div>
          <div className="add-div">
            <button onClick={handleAddTask} className="add-button">
              Add Task
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}

function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default Wrapper;
