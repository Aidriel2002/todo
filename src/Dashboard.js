import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './components/auth/firebase';
import { doc, getDocs, getDoc, updateDoc, addDoc, collection, setDoc } from 'firebase/firestore';
import './Dashboard.css';

function Dashboard() {
  const [displayName, setDisplayName] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const addTask = async () => {
    if (title.trim() === '' || description.trim() === '') return;

    try {
      const timestamp = new Date();
      const docRef = await addDoc(collection(db, 'tasks'), {
        userId: auth.currentUser.uid,
        title: title,
        description: description,
        completed: false,
        timestamp: timestamp.toISOString(),
      });

      console.log('Task added with ID: ', docRef.id);
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    } catch (e) {
      console.error('Error fetching tasks: ', e);
    }
  };

  const moveTask = (taskId) => {
    setSelectedTask(taskId);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setSelectedTask(null);
    setShowConfirmationModal(false);
  };

  const confirmMoveTask = async () => {
    try {
      if (!selectedTask) return;

      const taskDocRef = doc(db, 'tasks', selectedTask);
      const taskSnapshot = await getDoc(taskDocRef);

      if (taskSnapshot.exists()) {
        const taskData = taskSnapshot.data();
        const timestamp = new Date();
        await setDoc(doc(db, 'recycleBin', selectedTask), { ...taskData, timestamp: timestamp.toISOString() });
        await updateDoc(taskDocRef, { recycleBin: true });
        fetchTasks();
      }

      closeConfirmationModal();
    } catch (e) {
      console.error('Error moving task: ', e);
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
        fetchTasks();
      } else {
        setDisplayName(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <>
      <div className="d-container">
        <div className="d-center">
          <p className='greet'> <span>Welcome</span>  {` ${displayName}`}</p>
          <p className='question'> What's your plan for today?</p>
          <div>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button onClick={addTask}>Add Task</button>
          </div>
        </div>
      </div>

      <div className="task-list" id='tasks-list'>
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.recycleBin ? 'recycled' : ''}`}>
            <p>Title: {task.title}</p>
            <p>Description: {task.description}</p>
            <p>Created at: {new Date(task.timestamp).toLocaleString()}</p>
            <button onClick={() => moveTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>

      {showConfirmationModal && (
        <div className="modal" onClick={closeConfirmationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>Move task to Recycle Bin?</p>
            <button onClick={confirmMoveTask}>Yes</button>
            <button onClick={closeConfirmationModal}>No</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
