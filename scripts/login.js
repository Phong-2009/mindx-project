// login.js
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const form = document.querySelector("#form");

const handleLogin = async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    // 1) Đăng nhập qua Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2) Đọc document Firestore tại users/{uid}
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Nếu không tìm thấy document, logout và báo lỗi
      alert("User data not exist. Please register first.");
      await signOut(auth);
      return;
    }

    const userData = docSnap.data();
    console.log("User data:", userData);

    // 3) Kiểm tra role
    if (userData.role === "admin") {
      // If admin → chuyển đến trang admin
        alert(`Welcome Admin!`);
        window.location.href = "admin.html";
    } else {
      // Nếu user thường → chuyển về client‐homepage
        alert(`Login successful. Welcome ${userData.firstName} ${userData.lastName}!`);
        window.location.href = "index.html";
    }

  } catch (error) {
    console.error("Login failed:", error);
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      alert("Email hoặc mật khẩu không đúng.");
    } else {
      alert("Error " + error.message);
    }
  }
};

form.addEventListener("submit", handleLogin);
