import React from "react";
import { Link } from "react-router-dom";

function TaskItem({ task, onDelete }) {
  return (
    <li>
      <div>
        <strong>Description:</strong> {task.description}
      </div>
      <div>
        <strong>Status:</strong> {task.status}
      </div>
      <div>
        <strong>Priority:</strong> {task.priority}
      </div>
      <div>
        <strong>Assigned To:</strong> {task.assignedTo}
      </div>
      <div>
        <Link to={`/edit-task/${task.id}`}>Edit</Link>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
}

export default TaskItem;
