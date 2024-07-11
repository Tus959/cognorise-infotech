document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = { id: Date.now(), text: taskText };
            tasks.push(task);
            addTaskToDOM(task);
            saveTasksToLocalStorage();
            taskInput.value = '';
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const li = e.target.parentElement;
            li.classList.add('editing');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = li.firstChild.textContent;
            li.insertBefore(input, li.firstChild);
            li.removeChild(li.firstChild);
            e.target.textContent = 'Save';
            e.target.classList.remove('edit');
            e.target.classList.add('save');
        } else if (e.target.classList.contains('save')) {
            const li = e.target.parentElement;
            const input = li.firstChild;
            const taskText = input.value.trim();
            if (taskText) {
                const taskId = parseInt(li.getAttribute('data-id'));
                tasks = tasks.map(task => task.id === taskId ? { ...task, text: taskText } : task);
                li.insertBefore(document.createTextNode(taskText), input);
                li.removeChild(input);
                li.classList.remove('editing');
                e.target.textContent = 'Edit';
                e.target.classList.remove('save');
                e.target.classList.add('edit');
                saveTasksToLocalStorage();
            }
        } else if (e.target.classList.contains('delete')) {
            const li = e.target.parentElement;
            const taskId = parseInt(li.getAttribute('data-id'));
            tasks = tasks.filter(task => task.id !== taskId);
            taskList.removeChild(li);
            saveTasksToLocalStorage();
        }
    });

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.appendChild(document.createTextNode(task.text));
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        li.appendChild(editButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
