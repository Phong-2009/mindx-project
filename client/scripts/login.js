import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
// import { getDoc, collection, addDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
const result = document.getElementById('result');
const logOut = document.getElementById('log-out');
const form = document.querySelector('#form');

let user = null; //  Make user global

const handleLogin = async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    user = auth.currentUser; // 👈 Save logged in user

    if (user !== null) {
      const email = user.email;
      const uid = user.uid;
      console.log("User is logged in:", email, uid);
    }

    alert("You are now logged in!");

  //   const userData = {
  //     email,
  //     uid: user.uid,
  //     createdAt: new Date()
  // };
  //   const docRef = await addDoc(collection(db, "users"), userData);
  //   const userDoc = getDoc(docRef);
  //   if (userDoc.exists(user)) {
  //     document.getElementById("user-name").textContent = user.first_name + " " + user.last_name;
  //   } else {
  //     alert("User not found in database.");
  //   }

    window.location.href = 'purchase.html'; // Redirect to home page
  } catch (error) {
      alert("Login failed: " + error.message);
  }
};



form.addEventListener('submit', handleLogin);

// If already logged in, redirect to home page
// if (localStorage.getItem("currentUser")) {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     document.getElementById("user-name").textContent = currentUser.first_name + " " + currentUser.last_name;
//     location.href = "./index.html";
//   }
  
//   form.addEventListener("submit", (e) => {
//     e.preventDefault();
  
//     const users = JSON.parse(localStorage.getItem("users") || "[]");
  
//     if (users.length === 0) {
//       alert("No user found");
//       return;
//     }
  
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value.trim();
  
//     const existingUser = users.find(
//       (user) => user.email === email && user.password === password
//     );
  
//     if (existingUser) {
//       localStorage.setItem("currentUser", JSON.stringify(existingUser));
//       document.getElementById("user-name").textContent = existingUser.first_name + " " + existingUser.last_name;
//       location.href = "./index.html";
//     } else {
//       alert("Email or password is incorrect");
//     }
//   });