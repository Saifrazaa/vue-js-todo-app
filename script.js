const app = Vue.createApp({
  data() {
    const current_date = new Date();
    const day = current_date.getDate();
    const month = current_date.getMonth() + 1;
    const year = current_date.getFullYear();
    const today_is = year + "-0" + month + "-" + day;
    return {
      todos: [],
      previous_todos: [],
      upcoming_todos: [],
      todoVal: "",
      todoDate: "",
      completedTodos: [],
      notLoggedIn: true,
      email: "",
      password: "",
      today_date: today_is,
    };
  },

  mounted() {
    const getUser = localStorage.getItem("userLoggedIn");
    const d = localStorage.getItem("todos");
    const cd = localStorage.getItem("completedTodos");
    const pd = localStorage.getItem("previous_todos");
    const ud = localStorage.getItem("upcoming_todos");
    const todosData = JSON.parse(d);
    const completedData = JSON.parse(cd);
    const previousData = JSON.parse(pd);
    const upcomingData = JSON.parse(ud);

    if (todosData && todosData.length > 0) {
      this.todos = todosData;
    }
    if (completedData && completedData.length > 0) {
      this.completedTodos = completedData;
    }
    if (previousData && previousData.length > 0) {
      this.previous_todos = previousData;
    }
    if (upcomingData && upcomingData.length > 0) {
      this.upcoming_todos = upcomingData;
    }
    if (getUser) {
      this.notLoggedIn = false;
    }
  },
  methods: {
    handleTodo(event, type) {
      if (type === "todoVal") {
        this.todoVal = event.target.value;
      }
      if (type === "todoDate") {
        this.todoDate = event.target.value;
      }
    },
    compareDates(d1, d2) {
      let date1 = new Date(d1).getTime();
      let date2 = new Date(d2).getTime();

      if (date1 < date2) {
        return -1;
      } else if (date1 > date2) {
        return 1;
      } else {
        return 0;
      }
    },
    handleFormInput(event, field) {
      if (field === "email") {
        this.email = event.target.value;
      } else {
        this.password = event.target.value;
      }
    },
    handleLogin() {
      const d = localStorage.getItem("userCred");
      const user = JSON.parse(d);
      if (user.email === this.email && user.password === this.password) {
        this.email = "";
        this.password = "";
        this.notLoggedIn = false;
        localStorage.setItem("userLoggedIn", true);
      } else {
        alert("wrong credentials");
      }
    },
    handleLogout() {
      this.notLoggedIn = true;
      localStorage.removeItem("userLoggedIn");
    },
    addTodo() {
      if (this.todoVal !== "" && this.todoDate !== "") {
        const data = {
          title: this.todoVal,
          date: this.todoDate ? this.todoDate : this.today_date,
          completed: false,
        };
        const compareDates = this.compareDates(this.todoDate, this.today_date);
        if (compareDates === 0) {
          this.todos.push(data);
          localStorage.setItem("todos", JSON.stringify(this.todos));
        } else if (compareDates === -1) {
          this.previous_todos.push(data);
          localStorage.setItem(
            "previous_todos",
            JSON.stringify(this.previous_todos)
          );
        } else {
          this.upcoming_todos.push(data);
          localStorage.setItem(
            "upcoming_todos",
            JSON.stringify(this.upcoming_todos)
          );
        }
        this.todoVal = "";
      } else {
        alert("Invalid Data Entered");
      }
    },
    markCompleted(todo) {
      this.completedTodos.push(todo);
      this.todos = this.todos.filter((item) => item.title !== todo.title);
      localStorage.setItem("todos", JSON.stringify(this.todos));
      localStorage.setItem(
        "completedTodos",
        JSON.stringify(this.completedTodos)
      );
    },
    putBack(todo) {
      this.todos.push(todo);
      this.completedTodos = this.completedTodos.filter(
        (item) => item.title !== todo.title
      );
      localStorage.setItem("todos", JSON.stringify(this.todos));
      localStorage.setItem(
        "completedTodos",
        JSON.stringify(this.completedTodos)
      );
    },
    deleteFromTodo(todo) {
      this.todos = this.todos.filter((item) => item.title !== todo.title);
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    deleteFromCompletedTodo(todo) {
      this.completedTodos = this.completedTodos.filter(
        (item) => item.title !== todo.title
      );
      localStorage.setItem(
        "completedTodos",
        JSON.stringify(this.completedTodos)
      );
    },
  },
}).mount("#app");
