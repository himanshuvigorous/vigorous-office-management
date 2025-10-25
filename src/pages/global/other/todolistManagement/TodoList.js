import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Tooltip } from "antd";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { deleteTodoData, getTodoList, statusTodoList } from "./TodoTypeFeatures/_TodoType_reducers";
import CreateTodoList from "./CreateTodoList";
import UpdateTodoList from "./UpdateTodoList";

// 🎨 Enhanced Todo Item Card
const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
  const handleCheckboxChange = () => {
    const newStatus = todo.status === "completed" ? "pending" : "completed";
    onToggleComplete(todo._id, newStatus);
  };

  return (
    <div
      className={`group rounded-xl p-1 mb-1 bg-white border transition-all duration-300 hover:shadow-lg ${
        todo.status === "completed" 
          ? "border-green-100 bg-green-50/30" 
          : "border-gray-100 hover:border-blue-100"
      }`}
    >
      <div className="flex relative items-start gap-3">
        {/* Enhanced Checkbox */}
        <button
          onClick={handleCheckboxChange}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.status === "completed" 
              ? "bg-green-500 border-green-500 text-white shadow-sm" 
              : "border-gray-300 hover:border-green-400 hover:bg-green-50 group-hover:border-green-400"
          }`}
        >
          {todo.status === "completed" && <FaCheck size={10} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-gray-900 text-sm leading-tight ${
            todo.status === "completed" ? "line-through text-gray-500" : ""
          }`}>
            {todo.title}
          </h4>
          {todo.message && (
            <p className={`text-gray-600 text-xs mt-2 leading-relaxed ${
              todo.status === "completed" ? "line-through text-gray-400" : ""
            }`}>
              {todo.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex absolute top-2 right-2 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip title="Edit">
            <button
              onClick={() => onEdit(todo)}
              className="text-gray-400 hover:text-blue-600 p-2 rounded-lg transition-all duration-200 hover:bg-blue-50"
            >
              <FaPenToSquare size={14} />
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              onClick={() => onDelete(todo?._id)}
              className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-all duration-200 hover:bg-red-50"
            >
              <RiDeleteBin5Line size={14} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-between items-center mt-3">

        
        {/* Hover actions for mobile */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => onEdit(todo)}
            className="text-gray-400 hover:text-blue-600 p-1 rounded transition"
          >
            <FaPenToSquare size={14} />
          </button>
          <button
            onClick={() => onDelete(todo?._id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded transition"
          >
            <RiDeleteBin5Line size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 🧭 Todo Section (Column)
const TodoSection = ({ title, status, todos, onEdit, onDelete, onToggleComplete }) => {
  const filteredTodos = todos.filter(todo => todo.status === status);

  return (
    <div className="flex-1 min-w-[320px] bg-gray-50/50 rounded-xl border border-gray-100 p-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium min-w-[20px] text-center">
            {filteredTodos.length}
          </span>
        </div>
      </div>

      {/* Todo Cards */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8 text-sm">
            <div className="text-gray-300 mb-2">📝</div>
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
};

// 🧠 Main TodoList Component
function TodoList() {
  const { register, control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { TodoListData, loading } = useSelector((state) => state.todoList);

  const [createModal, setCreateModal] = useState({ data: null, isOpen: false });
  const [updateToDoList, setupdateToDoList] = useState({ data: null, isOpen: false });

  useEffect(() => {
    getToDoListListRequest();
  }, []);

  const getToDoListListRequest = () => {
    const data = {
      currentPage: null,
      pageSize: null,
      reqData: {
        text: "",
        status: "",
        sort: true,
        isPagination: false,
      },
    };
    dispatch(getTodoList(data));
  };

  const handleDelete = (id) => {
    let reqData = { _id: id };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTodoData(reqData)).then((data) => {
          if (!data?.error) {
            getToDoListListRequest();
          }
        });
      }
    });
  };

  const handleToggleComplete = (_id, newStatus) => {
    dispatch(statusTodoList({ _id, status: newStatus })).then(() => {
      getToDoListListRequest();
    });
  };

  return (
    <div className="p-2 bg-white rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-1.5 pb-1.5 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Todo List</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your tasks efficiently</p>
        </div>

        <button
          onClick={() => setCreateModal({ data: null, isOpen: true })}
          className="bg-blue-600 px-4 py-1.5 rounded-full flex items-center gap-2 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
        >
          <FaPlus size={14} />
          <span>Add Todo</span>
        </button>
      </div>

      {/* Todo Board */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
          <TodoSection
            title="Pending Tasks"
            status="pending"
            todos={TodoListData || []}
            onEdit={(todo) => setupdateToDoList({ data: todo, isOpen: true })}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
     
          
          <TodoSection
            title="Completed"
            status="completed"
            todos={TodoListData || []}
            onEdit={(todo) => setupdateToDoList({ data: todo, isOpen: true })}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      )}

      {/* Modals */}
      <CreateTodoList
        isOpen={createModal?.isOpen}
        handleClose={() => setCreateModal({ data: null, isOpen: false })}
        fetchList={getToDoListListRequest}
      />

      <UpdateTodoList
        isOpen={updateToDoList?.isOpen}
        parentData={updateToDoList?.data}
        handleClose={() => setupdateToDoList({ data: null, isOpen: false })}
        fetchList={getToDoListListRequest}
      />
    </div>
  );
}

export default TodoList;