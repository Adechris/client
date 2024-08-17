import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';


interface Todo {
    id: number;
    text: string;
    completed: boolean;
    time: string; // Add this line
  }

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodo, setEditTodo] = useState<Todo | null>(null);
    const [editText, setEditText] = useState('');
    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      fetchTodos();
    }, []);
  
    const fetchTodos = async () => {
      const { data } = await axios.get('http://localhost:3001/api/todos');
      setTodos(data);
    };


    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };
    // const addTodo = async () => {
    //     if (newTodo.trim()) {
    //       try {
    //         await axios.post('http://localhost:3001/api/todos', { text: newTodo });
    //         setNewTodo('');
    //         // Fetch the updated list of todos from the server
    //         const { data: updatedTodos } = await axios.get('http://localhost:3001/api/todos');
    //         setTodos(updatedTodos);
    //       } catch (error) {
    //         console.error('Error adding todo:', error);
    //       }
    //     }
    //   };

    const addTodo = async () => {
        if (newTodo.trim()) {
          try {
            const { data } = await axios.post('http://localhost:3001/api/todos', { text: newTodo, time: getCurrentTime() });
            setNewTodo('');
            const { data: updatedTodos } = await axios.get('http://localhost:3001/api/todos');
            setTodos(updatedTodos);
          } catch (error) {
            console.error('Error adding todo:', error);
          }
        }
      };
 


    const updateTodo = async (id: number, completed: boolean) => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        );
        setTodos(updatedTodos);
        const todoToUpdate = todos.find(todo => todo.id === id);
        if (todoToUpdate) {
          await axios.put(`http://localhost:3001/api/todos/${id}`, { text: todoToUpdate.text, completed });
        }
      };

    const deleteTodo = async (id: number) => {
      setTodos(todos.filter(todo => todo.id !== id));
      await axios.delete(`http://localhost:3001/api/todos/${id}`);
    };
  
    const handleEditTodo = (todo: Todo) => {
      setEditTodo(todo);
      setEditText(todo.text);
      setShowModal(true);
    };



    // const handleSaveEdit = async () => {
    //     if (editTodo) {
    //       const updatedTodo = { text: editText, completed: editTodo.completed };
    //       const { data } = await axios.put(`http://localhost:3001/api/todos/${editTodo.id}`, updatedTodo);
    //       setTodos(todos.map(todo => (todo.id === data.id ? data : todo)));
    //       setShowModal(false);
    //     }
    //   };

    const handleSaveEdit = async () => {
        if (editTodo) {
          const updatedTodo = { text: editText, completed: editTodo.completed, time: editTodo.time };
          const { data } = await axios.put(`http://localhost:3001/api/todos/${editTodo.id}`, updatedTodo);
          setTodos(todos.map(todo => (todo.id === data.id ? data : todo)));
          setShowModal(false);
        }
      };

  return (
    <Container className="my-4">
    <h1>Todo App</h1>
    <Form.Group className="mb-3">
      <Form.Control
        type="text"
        value={newTodo}
        className='shadow-none'
        onChange={e => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <Button variant="primary" onClick={addTodo} className="mt-2">
        Add
      </Button>
    </Form.Group>
    <Table   hover>
      <thead>
        <tr>
          <th>Todo</th>
          <th>Time</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  {todos.map(todo => (
    <tr key={todo.id}>
      <td style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</td>
      <td>{todo.time}</td>
      <td>
        <Form.Check
          type="checkbox"
          checked={todo.completed}
          onChange={() => updateTodo(todo.id, !todo.completed)}
        />
      </td>
      <td>
        <Button variant="primary" onClick={() => handleEditTodo(todo)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => deleteTodo(todo.id)} className="ms-2">
          Delete
        </Button>
      </td>
    </tr>
  ))}
</tbody>
    </Table>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </Container>
  )
}

export default TodoList