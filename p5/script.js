
document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    const getTasks = () => {
        try {
            return JSON.parse(localStorage.getItem("todo_tasks")) || [];
        } catch {
            return [];
        }
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    const updateCounter = (tasks) => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed === true).length;
        const incomplete = total - completed;

        taskCounter.textContent =
            `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${incomplete}`;
    };

    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";

        updateCounter(tasks);

        if (tasks.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "Belum ada tugas tersimpan.";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.color = "#64748b";
            emptyMessage.style.fontSize = "13px";
            emptyMessage.style.padding = "10px";

            todoList.appendChild(emptyMessage);
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            const text = document.createElement("span");
            text.className = "todo-text";
            text.textContent = task.text;

            const actions = document.createElement("div");
            actions.className = "todo-actions";

            const completeButton = document.createElement("button");
            completeButton.type = "button";
            completeButton.className = "action-btn complete-btn";
            completeButton.dataset.index = index;
            completeButton.textContent = task.completed ? "Batal" : "Selesai";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "action-btn delete-btn";
            deleteButton.dataset.index = index;
            deleteButton.textContent = "Hapus";

            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);

            li.appendChild(text);
            li.appendChild(actions);

            todoList.appendChild(li);
        });
    };

    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }

        taskInput.classList.remove("error");
        inputError.style.display = "none";

        const tasks = getTasks();

        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        taskInput.value = "";

        renderTasks();
        taskInput.focus();
    });

    taskInput.addEventListener("input", () => {
        if (taskInput.value.trim().length >= 3) {
            taskInput.classList.remove("error");
            inputError.style.display = "none";
        }
    });

    todoList.addEventListener("click", (event) => {
        const button = event.target.closest("button");

        if (!button || button.dataset.index === undefined) {
            return;
        }

        const index = Number(button.dataset.index);
        const tasks = getTasks();

        if (!tasks[index]) {
            return;
        }

        if (button.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;

            saveTasks(tasks);
            renderTasks();
        }

        if (button.classList.contains("delete-btn")) {
            const confirmed = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            if (confirmed) {
                tasks.splice(index, 1);

                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        const remainingTasks = tasks.filter(task => task.completed !== true);

        saveTasks(remainingTasks);
        renderTasks();
    });

    renderTasks();
});