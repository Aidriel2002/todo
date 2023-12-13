import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './auth/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

function RecycleBin({ onBackToDashboard }) {
  const [recycledTasks, setRecycledTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const fetchRecycledTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recycleBin'));
      const recycledTasksData = [];
      querySnapshot.forEach((doc) => {
        recycledTasksData.push({ id: doc.id, ...doc.data() });
      });
      setRecycledTasks(recycledTasksData);
    } catch (e) {
      console.error('Error fetching recycled tasks: ', e);
    }
  };

  const confirmDeletePermanently = (taskId) => {
    setSelectedTask(taskId);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setSelectedTask(null);
    setShowConfirmationModal(false);
  };

  const deletePermanently = async () => {
    try {
      if (!selectedTask) return;
  
      const taskDocRefInRecycleBin = doc(db, 'recycleBin', selectedTask);
      await deleteDoc(taskDocRefInRecycleBin);
      const deltask = doc(db, 'tasks', selectedTask);
      await deleteDoc(deltask);
      console.log('Deleted from recycleBin:', selectedTask);
      fetchRecycledTasks();
      closeConfirmationModal();
    } catch (e) {
      console.error('Error deleting permanently: ', e);
    }
  };
  

  const restoreTask = async (taskId) => {
    try {
      const taskDocRefInRecycleBin = doc(db, 'recycleBin', taskId);
      const taskSnapshot = await getDoc(taskDocRefInRecycleBin);

      if (taskSnapshot.exists()) {
        const taskData = taskSnapshot.data();
        const timestamp = new Date();
        await deleteDoc(taskDocRefInRecycleBin);
        console.log('Deleted from recycleBin:', taskId);
        await setDoc(doc(db, 'tasks', taskData.id), { ...taskData, timestamp: timestamp.toISOString() });

        fetchRecycledTasks();
      } else {

        console.error('Error restoring task: Document does not exist');
      }
    } catch (e) {
      console.error('Error restoring task: ', e);
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {

        fetchRecycledTasks();
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div id="RecycleBin" className="recycle-bin">
      <h2>Recycle Bin</h2>

      {recycledTasks.map((task) => (
        <div key={task.id} className="recycled-task-item">
          <p>Title: {task.title}</p>
          <p>Description: {task.description}</p>
          <p>Timestamp: {new Date(task.timestamp).toLocaleString()}</p>
          <button onClick={() => restoreTask(task.id)}>Restore</button>
          <button onClick={() => confirmDeletePermanently(task.id)}>Delete Permanently</button>
        </div>
      ))}


      {showConfirmationModal && (
        <div className="modal" onClick={closeConfirmationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>Delete task permanently?</p>
            <button onClick={deletePermanently}>Yes</button>
            <button onClick={closeConfirmationModal}>No</button>
          </div>
        </div>
      )}


      <button onClick={onBackToDashboard}>Back to Dashboard</button>
    </div>
  );
}

export default RecycleBin;
