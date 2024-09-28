import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './EditTask.css'; // Import the CSS file

function EditTask() {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    assignedTo: "",
    status: "Not Started",
    dueDate: "",
    priority: "Low",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskResponse = await axios.get(`http://localhost:5000/tasks/${id}`);
        const usersResponse = await axios.get("http://localhost:5000/users");
        setTask(taskResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.assignedTo || !task.dueDate || !task.description) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, task);
      navigate("/");
    } catch (err) {
      setError("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="edit-task-container">
      {loading ? (
        <p>Loading task...</p>
      ) : (
        <form onSubmit={handleSubmit} className="edit-task-form">
          <h2>Edit Task</h2>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}

          <label>Assigned To</label>
          <select name="assignedTo" value={task.assignedTo} onChange={handleChange}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>

          <label>Status</label>
          <select name="status" value={task.status} onChange={handleChange}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
          />

          <label>Priority</label>
          <select name="priority" value={task.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label>Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            maxLength="100"
          />

          <button type="submit" className="submit-button">Update Task</button>
        </form>
      )}
    </div>
  );
}

export default EditTask;
