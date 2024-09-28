import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './TaskList.css'; 

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  // Fetch tasks from the server
  const fetchTasks = () => {
    axios.get("http://localhost:5000/tasks").then((response) => {
      setTasks(response.data);
    });
  };

  // useEffect to fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const handleDeleteSelected = () => {
    selectedTasks.forEach((taskId) => {
      deleteTask(taskId);
    });
    // Clear selected tasks after deletion
    setSelectedTasks([]); 
  };

  const toggleTaskSelection = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  const handleActionChange = (taskId, action) => {
    if (action === "edit") {
      navigate(`/edit-task/${taskId}`);
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTask(taskId);
      }
    }
  };

  // Function to refresh the task list
  const handleRefresh = () => {
    // Call fetchTasks to refresh the data
    fetchTasks(); 
  };

  
  const filteredTasks = tasks.filter((task) =>
    task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.dueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <h1 className="heading">All Tasks</h1>
      
       {/* Search Bar */}
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }} className="searchButton">
        <input 
          type="text" 
          placeholder="Search by Assigned To, Status, Due Date, Priority..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="search-bar"
          style={{ padding: '5px', fontSize: '16px', width: '300px' }}
        />
      
      {/* Add-Task button and Refresh button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div>
          <Link to="/add-task" className="add-task-button">
            Add Task
          </Link>
          <button className="refresh-button" onClick={handleRefresh} style={{ marginLeft: '10px' }}>
            Refresh
          </button>
        </div>
      </div>
      </div>

     

      {/* Table to display tasks */}
      
      <table border="1" cellPadding="10" cellSpacing="0" className="Tas" >
        <thead>
          <tr>
            <th>Select</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className="Tab" >
              <td>
                <input
                  type="checkbox"
                  onChange={() => toggleTaskSelection(task.id)}
                  checked={selectedTasks.includes(task.id)}
                />
              </td>
              <td>{task.assignedTo}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>{task.description}</td>
              <td>
               
                <select
                  onChange={(e) => handleActionChange(task.id, e.target.value)}
                  defaultValue="" 
                  
                >
                  <option value="" disabled >
                    Select Action
                  </option>
                  <option value="edit">Edit</option>
                  <option value="delete">Delete</option>
                </select>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      

      {/* Row counter */}
      <div style={{ marginTop: '10px', textAlign: 'left' }} className="totalTask">
        {`Total Tasks: ${filteredTasks.length}`}
      </div>

      {/* Show delete button when any check-box is checked */}
      {selectedTasks.length > 0 && (
        <button onClick={handleDeleteSelected} style={{ marginTop: "10px" }} className="delete">
          Delete Selected
        </button>
      )}
    </div>
  );
}

export default TaskList;
