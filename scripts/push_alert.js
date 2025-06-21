import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
const auth = getAuth();
const db = getFirestore();
const notifyForm = document.getElementById("notify-form");

// Check if user is logged in and is an admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists() || userSnap.data().role !== "admin") {
    window.location.href = "./login.html";
    return;
  }
  // User is admin, allow access
});
notifyForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("notify-title").value;
  const message = document.getElementById("notify-message").value;

  await addDoc(collection(db, "notifications"), {
    title,
    message,
    icon: "fa-bell",
    time: serverTimestamp(),
    unread: true // default for all users
  });

  document.getElementById("notify-success").classList.remove("d-none");
  setTimeout(() => {
    document.getElementById("notify-success").classList.add("d-none");
    notifyForm.reset();
  }, 2500);
};