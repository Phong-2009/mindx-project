import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const db = getFirestore();
const notifyForm = document.getElementById("notify-form");

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