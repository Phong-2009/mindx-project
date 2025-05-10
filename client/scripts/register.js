import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const form = document.querySelector("#form");

const handleRegister = async (event) => {
  event.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6 || confirmPassword.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert("User registered successfully");

    const userData = {
      firstName,
      lastName,
      email,
      money: 0, // default balance
      createdAt: new Date()
    };

    // Save user data in Firestore using their UID
    await setDoc(doc(db, "users", user.uid), userData);

    alert("Account data saved to Firestore!");
    window.location.href = "login.html"; // Or move to homepage, etc.
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already in use. Please use a different one or log in.");
      window.location.href = 'login.html';
    } else {
      alert(`Registration error: ${error.message}`);
    }
    console.error("Error creating user:", error);
  }
};

form.addEventListener("submit", handleRegister);
