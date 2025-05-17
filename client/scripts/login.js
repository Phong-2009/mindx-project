import { auth, db } from './firebase-config.js';
// import { signOut, deleteUser } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc  } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
const logOut = document.getElementById('log-out');
const form = document.querySelector('#form');

let user = null; //  Make user global
const handleLogin = async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    user = userCredential.user;

    // Get Firestore user doc using UID
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("User data:", userData);
      alert(`Welcome back, ${userData.firstName} ${userData.lastName}!`);


      await setDoc(docRef, userData);
      
      // document.getElementById('user-confirm').innerHTML = `
      //   <a id="username" class="nav-link p-2 bd-highlight custom-login-link" href="#">${userData.firstName} ${userData.lastName}</a>
      //   <a id="logout" class="nav-link p-2 bd-highlight custom-login-link" href="#">LOGOUT</a>
      // `;

      window.location.href = "purchase.html"; 
    } else {
      console.log("No user data found in Firestore.");
    }

  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// const handleLogOut = async (e) => {
//   e.preventDefault();

//   try {
//     if (user) {
//       await deleteUser(user); // Delete user first while logged in
//       console.log("User deleted successfully");
//     }
    
//     await signOut(auth); // Then sign out
//     result.innerHTML = '';
//     logOut.style.display = 'none';
//     alert("You are now logged out!");
//     window.location.href = 'register.html';
//   } catch (error) {
//       alert("Logout or delete failed: " + error.message);
//       console.log("Logout error: ", error);
//   }
// };

// logOut.addEventListener('click', handleLogOut);
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