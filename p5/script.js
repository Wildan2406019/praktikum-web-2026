document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");

    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";

        if (tasks.length === 0) {
            todoList.innerHTML = "<li style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</li>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button type="button" class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>
                    <button type="button" class="action-btn delete-btn" data-index="${index}">
                        Hapus
                    </button>
                </div>
            `;

            todoList.appendChild(li);
        });
    };

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

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
    });

    todoList.addEventListener("click", (e) => {
        const button = e.target.closest("button");

        if (!button || button.dataset.index === undefined) {
            return;
        }

        const index = Number(button.dataset.index);
        const tasks = getTasks();

        if (button.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
            renderTasks();
        } else if (button.classList.contains("delete-btn")) {
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        }
    });

    renderTasks();
});