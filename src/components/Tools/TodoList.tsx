import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TodoList = () => {
  // Load todos from localStorage on initial render
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert string dates back to Date objects
        return parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
      } catch (error) {
        console.error('Failed to parse todos from localStorage', error);
        return [];
      }
    }
    return [];
  });
  
  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage', error);
    }
  }, [todos]);
  const [formData, setFormData] = useState<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>({ 
    title: '', 
    description: '', 
    status: 'pending',
    isCompleted: false 
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isCompleted' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const now = new Date();
    
    if (editingId) {
      setTodos(todos.map(todo => 
        todo.id === editingId 
          ? { ...formData, id: editingId, updatedAt: now, createdAt: todo.createdAt }
          : todo
      ));
      setEditingId(null);
    } else {
      const newTodo: Todo = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setTodos([...todos, newTodo]);
    }

    setFormData({ title: '', description: '', status: 'pending', isCompleted: false });
  };

  const handleEdit = (todo: Todo) => {
    setFormData({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      isCompleted: todo.isCompleted
    });
    setEditingId(todo.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const handleView = (todo: Todo) => {
    setViewingTodo(todo);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Todo List</h1>
      
      {/* Todo Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter todo title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter todo description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center h-5">
                <input
                  id="isCompleted"
                  name="isCompleted"
                  type="checkbox"
                  checked={formData.isCompleted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-700">
                Mark as completed
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', description: '', status: 'pending', isCompleted: false });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingId ? 'Update Todo' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Todos ({todos.length})</h2>
        </div>
        
        {todos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No todos found. Add your first todo above!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {todos.map(todo => (
              <li key={todo.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => {
                        const updatedTodo = { ...todo, isCompleted: !todo.isCompleted, updatedAt: new Date() };
                        setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <h3 className={`text-lg font-medium ${todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {todo.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {format(new Date(todo.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(todo.status)}`}>
                      {todo.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(todo)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {todo.description && (
                  <p className="mt-2 text-sm text-gray-600 pl-7">
                    {todo.description.length > 100 
                      ? `${todo.description.substring(0, 100)}...` 
                      : todo.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View Todo Modal */}
      {showModal && viewingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{viewingTodo.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingTodo.status)}`}>
                  {viewingTodo.status.replace('-', ' ')}
                </span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewingTodo.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {viewingTodo.isCompleted ? 'Completed' : 'Not Completed'}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{viewingTodo.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Created At:</p>
                  <p>{format(new Date(viewingTodo.createdAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated:</p>
                  <p>{format(new Date(viewingTodo.updatedAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(viewingTodo);
                    setShowModal(false);
                  }}
                  className="mr-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Todo
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
