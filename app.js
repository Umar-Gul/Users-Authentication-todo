// LOGIN
if (location.pathname.includes('login.html')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'home.html';
        } else {
            alert('Invalid Email or Password');
        }
    });
}

// REGISTER
if (location.pathname.includes('register.html')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        let users = [];
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users'));
            if (Array.isArray(storedUsers)) {
                users = storedUsers;
            }
        } catch (err) {
            users = [];
        }

        const exists = users.some(function(u) {
            return u.email === email;
        });

        if (exists) {
            alert('Email already registered!');
            return;
        }

        users.push({ fullName, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration Successful! Please login.');
        window.location.href = 'login.html';
    });
}


// HOME
if (location.pathname.includes('home.html')) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('userName').innerText = user.fullName;
        loadTodos();
    }

    document.getElementById('todoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTodo();
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    if (!todoText) return;

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const key = `todos_${user.email}`;
    const todos = JSON.parse(localStorage.getItem(key)) || [];
    todos.push(todoText);
    localStorage.setItem(key, JSON.stringify(todos));

    todoInput.value = '';
    loadTodos();
}

function loadTodos() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const key = `todos_${user.email}`;
    const todos = JSON.parse(localStorage.getItem(key)) || [];

    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.textContent = todo;
        li.onclick = () => removeTodo(index);
        todoList.appendChild(li);
    });
}

function removeTodo(index) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const key = `todos_${user.email}`;
    const todos = JSON.parse(localStorage.getItem(key)) || [];
    todos.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(todos));
    loadTodos();
}
