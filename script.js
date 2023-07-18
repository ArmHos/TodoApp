class Todo {
    constructor() {
        this.input = document.querySelector("input");
        this.addButton = document.querySelector(".add-button");
        this.todoBody = document.querySelector(".todo-body");
        this.modal = document.querySelector(".delete-modal");
        this.confirmButton = document.querySelector(".confirm-button");
        this.rejectButton = document.querySelector(".reject-button");
        this.id = null;
        this.hideDiv = document.querySelector(".hide");
        this.hideButton = document.querySelector(".hide-button");
        this.isHidden = false;
        if (localStorage.getItem("data")) {
            this.data = JSON.parse(localStorage.getItem("data"));
        } else {
            localStorage.setItem("data", JSON.stringify([]));
        }
    }
    storeData(data) {
        localStorage.setItem("data", JSON.stringify(data));
        // console.log(JSON.parse(localStorage.getItem("data")));
    }
    clearTodo() {
        this.todoBody.innerHTML = "";
    }
    clearInput() {
        this.input.value = "";
    }
    inputStyles(type) {
        if (type === "add") {
            if (this.input.value.trim()) {
                this.input.style.border = "1px solid #ffcd04";
                this.input.placeholder = "Write here";
            } else {
                this.input.style.border = "1px solid red";
                this.input.placeholder = "Please fill the input";
            }
        } else if (type === "search") {
            this.input.style.border = "1px solid #ffcd04";
            this.input.placeholder = "Write here";
        }
    }
    addTodo() {
        let value = this.input.value.trim();
        this.hideDiv.style.display = "flex";
        this.inputStyles("add");
        if (value) {
            this.data.push({
                id: this.data.length + 1,
                title: value,
                isChecked: false
            })
            this.storeData(this.data);
            this.sortingData();
            this.checkHidden();
        }
        this.clearInput();
    }
    addTodoListeners() {
        this.addButton.addEventListener("click", () => {
            this.addTodo();
        })
        document.addEventListener("keypress", (e) => {
            if (e.code === "Enter") {
                this.addTodo();
            }
        })
    }
    drawTodo(data = this.data) {
        this.clearTodo();
        data.forEach(item => {
            const todo = this.createElements("div", "todo-elem");
            const span = this.createElements("span", "todo-elem-span", item);
            const delButton = this.createElements("div", "todo-elem-delete-button");
            const checkbox = this.createElements("div", "todo-elem-checkbox");
            const container = this.createElements("div", "todo-elem-container");
            const divider = this.createElements("hr", "divider");
            delButton.addEventListener("click", () => {
                this.id = item.id;
                this.modal.style.display = 'block';
            });
            this.check(item, checkbox, span);
            checkbox.addEventListener("click", () => {
                item.isChecked = !item.isChecked;
                this.storeData(this.data);
                this.sortingData();
                this.checkHidden();
            })
            container.append(checkbox, span)
            todo.append(container, delButton);
            this.todoBody.append(todo, divider);
        })
    }
    delete(id) {
        this.data = this.data.filter(elem => {
            return elem.id !== id;
        })
        this.storeData(this.data);
        this.checkHidden();
    }
    confirmAndRejectListeners() {
        this.confirmButton.addEventListener("click", () => {
            this.delete(this.id);
            // console.log(this.id);
            this.modal.style.display = 'none';
        });
        this.rejectButton.addEventListener("click", () => {
            this.modal.style.display = 'none';
        });
        window.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        })
    }
    check(elem, checkbox, span) {
        if (elem.isChecked) {
            checkbox.style.border = "none";
            checkbox.style.backgroundImage = "url(./icons/checkbox.png)";
            span.style.color = '#ACACAC';
        } else {
            checkbox.style.backgroundColor = "white";
            checkbox.style.border = "solid #008594 2px";
            span.style.color = '#666666';
        }
    }
    createElements(elementType, className, dataItem) {
        const element = document.createElement(`${elementType}`);
        element.classList.add(`${className}`);
        if (elementType === "span" && dataItem) {
            element.innerHTML = `${dataItem.title}`;
        } else if (elementType === "button") {
            element.innerHTML = 'del';
        }
        return element;
    }
    sortingData() {
        this.data.sort((obj1, obj2) => {
            return obj1.isChecked - obj2.isChecked;
        })
        this.storeData(this.data);
    }
    checkHidden() {
        let data = [];
        if (this.isHidden) {
            data = this.data.filter(elem => {
                return elem.isChecked !== true;
            })
            this.clearTodo();
            this.drawTodo(data);
        } else {
            this.clearTodo();
            this.drawTodo();
        }
    }
    hideButtonListener() {
        this.hideButton.addEventListener('click', () => {
            this.isHidden = !this.isHidden;
            if (this.isHidden) {
                this.hideButton.style.border = "none";
                this.hideButton.style.backgroundImage = "url(./icons/checkbox.png)";
            } else {
                this.hideButton.style.border = "solid #008594 2px";
                this.hideButton.style.backgroundImage = "none";
            }
            this.checkHidden();
        })
    }
    searchTodo() {
        let value = this.input.value.trim();
        this.inputStyles("search");
        let data = [];
        if (value) {
            data = this.data.filter(elem => {
                let title = this.filterSpaces(elem.title)
                value = this.filterSpaces(value);
                return title.toLowerCase().includes(value.toLowerCase());
            })
            if (data.length) {
                this.clearTodo();
                this.drawTodo(data);
            } else {
                this.input.style.border = "1px solid #ffcd04";
                this.input.placeholder = "Write here";
                this.todoBody.innerHTML = "<div class='not-found'><span>The task was not found, but you can add it.</span></div>";
            }
        }
        else {
            this.clearTodo();
            this.checkHidden();
        }
    }
    filterSpaces(str) {
        let arrOfStr = str.split("").filter(char => {
            return char !== " ";
        });
        return arrOfStr.join("");
    }
    searchListeners() {
        this.input.addEventListener("input", () => {
            this.searchTodo();
        });
    }
    todoListeners() {
        this.addTodoListeners();
        this.confirmAndRejectListeners();
        this.hideButtonListener();
        this.searchListeners();
    }
    checkData() {
        if (this.data.length) {
            this.drawTodo();
            this.hideDiv.style.display = "flex";
        }
    }
    main() {
        this.checkData();
        this.todoListeners();
    }
}
const todo = new Todo;
todo.main();