/* ==========================================
   TO-DO LIST APPLICATION
   JavaScript Logic & State Management
   ========================================== */


/* ==========================================
   1. APPLICATION STATE
   ========================================== */

let tasks = [];

let currentFilter = "all";

const STORAGE_KEY = "todoTasks";


/* ==========================================
   2. DOM ELEMENTS
   ========================================== */

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");

const clearCompletedButton =
    document.getElementById("clear-completed");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* ==========================================
   3. LOAD TASKS FROM LOCAL STORAGE
   ========================================== */

function loadTasks() {

    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {

        try {

            tasks = JSON.parse(savedTasks);

        } catch (error) {

            console.error(
                "Unable to load saved tasks.",
                error
            );

            tasks = [];
        }

    }

}


/* ==========================================
   4. SAVE TASKS TO LOCAL STORAGE
   ========================================== */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


/* ==========================================
   5. GENERATE UNIQUE ID
   ========================================== */

function generateId() {

    return Date.now().toString() +
           Math.random().toString(36).substring(2);

}


/* ==========================================
   6. CREATE TASK
   ========================================== */

function addTask(text) {

    const trimmedText = text.trim();

    if (!trimmedText) {
        return;
    }


    const newTask = {

        id: generateId(),

        text: trimmedText,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

}


/* ==========================================
   7. READ / DISPLAY TASKS
   ========================================== */

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    if (filteredTasks.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.className =
            "empty-message";

        emptyMessage.textContent =
            getEmptyMessage();

        taskList.appendChild(emptyMessage);

    } else {

        filteredTasks.forEach(task => {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(taskElement);

        });

    }


    updateTaskCount();

}


/* ==========================================
   8. FILTER TASKS
   ========================================== */

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        return tasks.filter(
            task => task.completed
        );

    }


    return tasks;

}


/* ==========================================
   9. EMPTY MESSAGE
   ========================================== */

function getEmptyMessage() {

    if (currentFilter === "active") {

        return "No active tasks.";

    }

    if (currentFilter === "completed") {

        return "No completed tasks.";

    }

    return "No tasks yet. Add your first task!";

}


/* ==========================================
   10. CREATE DYNAMIC DOM ELEMENT
   ========================================== */

function createTaskElement(task) {

    const listItem =
        document.createElement("li");

    listItem.className = "task-item";

    listItem.dataset.id = task.id;


    if (task.completed) {

        listItem.classList.add("completed");

    }


    /* Checkbox */

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className =
        "task-checkbox";

    checkbox.checked =
        task.completed;

    checkbox.setAttribute(
        "aria-label",
        `Mark "${task.text}" as completed`
    );


    /* Task Text */

    const taskText =
        document.createElement("span");

    taskText.className =
        "task-text";

    taskText.textContent =
        task.text;


    /* Action Container */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /* Edit Button */

    const editButton =
        document.createElement("button");

    editButton.type = "button";

    editButton.className =
        "edit-btn";

    editButton.dataset.action =
        "edit";

    editButton.textContent =
        "Edit";

    editButton.setAttribute(
        "aria-label",
        `Edit task: ${task.text}`
    );


    /* Delete Button */

    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
        "delete-btn";

    deleteButton.dataset.action =
        "delete";

    deleteButton.textContent =
        "Delete";

    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${task.text}`
    );


    /* Build DOM */

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);

    listItem.appendChild(checkbox);

    listItem.appendChild(taskText);

    listItem.appendChild(actions);


    return listItem;

}


/* ==========================================
   11. UPDATE TASK
   ========================================== */

function updateTask(taskId, newText) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    const trimmedText =
        newText.trim();


    if (!trimmedText) {
        return;
    }


    task.text = trimmedText;

    saveTasks();

    renderTasks();

}


/* ==========================================
   12. TOGGLE TASK COMPLETION
   ========================================== */

function toggleTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();

}


/* ==========================================
   13. DELETE TASK
   ========================================== */

function deleteTask(taskId) {

    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks();

    renderTasks();

}


/* ==========================================
   14. UPDATE TASK COUNTER
   ========================================== */

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        );


    const count =
        activeTasks.length;


    if (count === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${count} tasks remaining`;

    }

}


/* ==========================================
   15. EDIT TASK
   ========================================== */

function editTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    const newText =
        window.prompt(
            "Edit your task:",
            task.text
        );


    if (newText === null) {
        return;
    }


    updateTask(
        taskId,
        newText
    );

}


/* ==========================================
   16. EVENT: ADD TASK
   ========================================== */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        addTask(taskInput.value);


        taskInput.value = "";


        taskInput.focus();

    }
);


/* ==========================================
   17. EVENT DELEGATION
   ========================================== */

taskList.addEventListener(
    "click",
    function (event) {

        const target =
            event.target;


        const taskItem =
            target.closest(".task-item");


        if (!taskItem) {
            return;
        }


        const taskId =
            taskItem.dataset.id;


        const action =
            target.dataset.action;


        if (action === "edit") {

            editTask(taskId);

        }


        if (action === "delete") {

            deleteTask(taskId);

        }

    }
);


/* ==========================================
   18. EVENT DELEGATION FOR CHECKBOX
   ========================================== */

taskList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
        ) {
            return;
        }


        const taskItem =
            event.target.closest(".task-item");


        if (!taskItem) {
            return;
        }


        const taskId =
            taskItem.dataset.id;


        toggleTask(taskId);

    }
);


/* ==========================================
   19. FILTER EVENTS
   ========================================== */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                        btn.setAttribute(
                            "aria-pressed",
                            "false"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );


                renderTasks();

            }
        );

    }
);


/* ==========================================
   20. CLEAR COMPLETED TASKS
   ========================================== */

clearCompletedButton.addEventListener(
    "click",
    function () {

        tasks =
            tasks.filter(
                task => !task.completed
            );


        saveTasks();

        renderTasks();

    }
);


/* ==========================================
   21. INITIALIZE APPLICATION
   ========================================== */

loadTasks();

renderTasks();