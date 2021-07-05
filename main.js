const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// select element in dom
const form = $('#itemForm');
const todoInput = $('#todoInput');
const listItem = $('#itemList');


// create an empty array
let todoItems = [];

function start() {
    handleCreateForm();
    getLocalStorage();
    
}
start();

// function to add todo
function addTodo(item) {
    const itemName = todoInput.value.trim();
    const checkNameExist = todoItems.some(i => i.name.includes(itemName));
    let currentItemIndex = $("#current-item").value;
    // if item is not empty
    if(itemName.length === 0) {
        toast({
            title: "Errors!",
            message: "Please enter the task name.",
            type: "error",
            duration: 5000
        });
    // if item is exists
    }else if(checkNameExist) {
        toast({
            title: "Errors!",
            message: "The task name is exists. Please enter the other name.",
            type: "error",
            duration: 5000
        });
    // update
    }else if(currentItemIndex) {
        updateItem(currentItemIndex, itemName);
        todoInput.value = '';
        currentItemIndex = "";
        toast({
            title: "Congratulation!",
            message: "The task name has been updated.",
            type: "success",
            duration: 5000
        });
    }else {
        // make a todo object
        const todo = {
            name: item,
            isDone: false
        };
  
        // add it to todo array
        todoItems.push(todo);
        setLocalStorage(todoItems);
  
        // clear the input box value
        todoInput.value = '';
    }
}

// render list todo items
function getList(data) {
    if(data.length > 0) {
        const html = data.map((item)=> {
            const isDone = item.isDone ? 'done': '';
            const iconClass = item.isDone ? 'fa-check-circle' : 'fa-check-circle-o';
            return `<li class="list-group-item d-flex justify-content-between">
            <span class="task-name ${isDone}">${item.name}</span>
            <span>
                <a href="#" class="btn-done"><i class="fa ${iconClass} green" aria-hidden="true"></i></a>
                <a href="#" class="btn-update"><i class="fa fa-pencil-square-o blue" aria-hidden="true"></i></a>
                <a href="#" class="btn-delete"><i class="fa fa-trash-o red" aria-hidden="true"></i></a>
            </span>
        </li>`;
        });
        listItem.innerHTML = html.join('');
        handleItem();
    }else {
        listItem.innerHTML =
            `<li class="list-group-item d-flex justify-content-between">
                No record found.
            </li>`;
    }
}

//handle event button action
function handleItem() {  
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item, index) => {
        //remove 
        item.querySelector(".btn-delete").addEventListener("click", function (e) {
            e.preventDefault();
            listItem.removeChild(item);
            todoItems.splice(index, 1);
            setLocalStorage(todoItems);
            toast({
                title: "Success",
                message: "The task has been successfully deleted",
                type: "success",
                duration: 5000
            });
        });

        //done 
        item.querySelector(".btn-done").addEventListener("click", function (e) {
            e.preventDefault();
            const currentItem = todoItems[index];
            const currentClass = currentItem.isDone
          ? "fa-check-circle-o"
          : "fa-check-circle";
            currentItem.isDone = currentItem.isDone ? false : true;
            todoItems.splice(index, 1, currentItem);
            
            setLocalStorage(todoItems);
            
            const iconClass = currentItem.isDone
            ? "fa-check-circle-o"
            : "fa-check-circle";

            this.firstElementChild.classList.replace(currentClass, iconClass);
        });

        // update
        item.querySelector(".btn-update").addEventListener("click", function (e) {
            e.preventDefault();
            const currentItem = todoItems[index];
            todoInput.value = currentItem.name;
            document.querySelector("#current-item").value = index;
        });
    });
}

// update item
function updateItem(itemIndex, newValue) {
    const newItem = todoItems[itemIndex];
    newItem.name = newValue;
    todoItems.splice(itemIndex, 1, newItem);
    setLocalStorage(todoItems);
}

// get local storage from the page
function getLocalStorage() {
    const reference  = localStorage.getItem("todoItems");
    if (reference) {
        todoItems = JSON.parse(reference);
    }else {
        todoItems = [];
    }
    getList(todoItems);
}

// set in local storage
function setLocalStorage(todoItems) {
    // convert
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
    // render them to screen
    getList(todoItems);
}


//form handle
function handleCreateForm() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTodo(todoInput.value);
    });
}

// Toast function
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
      const toast = document.createElement("div");
  
      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toast);
      }, duration + 1000);
  
      // Remove toast when clicked
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")) {
          main.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      };
  
      const icons = {
        success: "fa fa-check-circle",
        info: "fa fa-info-circle",
        warning: "fa fa-exclamation-circle",
        error: "fa fa-exclamation-circle"
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);
  
      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
  
      toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fa fa-times"></i>
                      </div>
                  `;
      main.appendChild(toast);
    }
}


  