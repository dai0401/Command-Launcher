document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const newTodoDate = document.getElementById('new-todo-date');
    const newTodoTime = document.getElementById('new-todo-time');
    const newTodoContent = document.getElementById('new-todo-content');

    let todos = [];

    // --- Main Functions ---

    const saveTodos = () => {
        chrome.storage.local.set({ 'todoItems': todos });
    };

    const renderTodos = () => {
        todoList.innerHTML = ''; // Clear the list
        
        // Sort todos: incomplete first, then by date/time
        todos.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            const dateTimeA = new Date(`${a.date || '1970-01-01'}T${a.time || '00:00'}`);
            const dateTimeB = new Date(`${b.date || '1970-01-01'}T${b.time || '00:00'}`);
            return dateTimeA - dateTimeB;
        });

        todos.forEach(todo => {
            const item = document.createElement('li');
            item.classList.add('todo-item');
            if (todo.completed) {
                item.classList.add('completed');
            }
            item.dataset.id = todo.id;

            const checked = todo.completed ? 'checked' : '';
            const dateTime = (todo.date || todo.time) ? `${todo.date || ''} ${todo.time || ''}`.trim() : 'No date/time';

            item.innerHTML = `
                <input type="checkbox" class="complete-checkbox" ${checked}>
                <div class="todo-details">
                    <div class="todo-datetime">${dateTime}</div>
                    <div class="todo-content">${todo.content}</div>
                </div>
                <button class="delete-btn">&times;</button>
            `;
            todoList.appendChild(item);
        });
    };

    const loadTodos = () => {
        chrome.storage.local.get('todoItems', (data) => {
            if (data.todoItems) {
                todos = data.todoItems;
                renderTodos();
            }
        });
    };

    const addTodo = () => {
        const content = newTodoContent.value.trim();
        if (!content) {
            alert('Please enter a to-do item.');
            return;
        }

        const newTodo = {
            id: Date.now(),
            date: newTodoDate.value,
            time: newTodoTime.value,
            content: content,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();

        // Clear input fields
        newTodoContent.value = '';
    };

    // --- Event Listeners ---

    addTodoBtn.addEventListener('click', addTodo);
    newTodoContent.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Event delegation for complete/delete
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const parentItem = target.closest('.todo-item');
        if (!parentItem) return;

        const todoId = Number(parentItem.dataset.id);

        if (target.classList.contains('delete-btn')) {
            todos = todos.filter(todo => todo.id !== todoId);
            saveTodos();
            renderTodos();
        } else if (target.classList.contains('complete-checkbox')) {
            const todo = todos.find(todo => todo.id === todoId);
            if (todo) {
                todo.completed = target.checked;
                saveTodos();
                renderTodos(); // Re-render to apply style and sorting
            }
        }
    });

    // --- Initial Load ---
    loadTodos();
});