// If already logged in, redirect to home page
if (localStorage.getItem("currentUser")) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("user-name").textContent = currentUser.first_name + " " + currentUser.last_name;
    location.href = "./index.html";
  }
  
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    if (users.length === 0) {
      alert("No user found");
      return;
    }
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    const existingUser = users.find(
      (user) => user.email === email && user.password === password
    );
  
    if (existingUser) {
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      document.getElementById("user-name").textContent = existingUser.first_name + " " + existingUser.last_name;
      location.href = "./index.html";
    } else {
      alert("Email or password is incorrect");
    }
  });