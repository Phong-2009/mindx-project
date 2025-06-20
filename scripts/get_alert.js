import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const db = getFirestore();
const notificationsRef = collection(db, "notifications");
const notificationsList = document.getElementById("notifications-list");
const noNoti = document.getElementById("no-notification");

// Lắng nghe realtime Firestore
onSnapshot(query(notificationsRef, orderBy("time", "desc")), (snapshot) => {
  notificationsList.innerHTML = "";
  if (snapshot.empty) {
    noNoti.style.display = "block";
    return;
  }
  noNoti.style.display = "none";
  snapshot.forEach((docSnap) => {
    const n = docSnap.data();
    const div = document.createElement("div");
    div.className = "notification-item" + (n.unread ? " unread" : "");
    div.innerHTML = `
      <span class="notification-icon"><i class="fa ${n.icon || "fa-bell"}"></i></span>
      <div class="notification-title">${n.title}</div>
      <div class="notification-message">${n.message}</div>
      <div class="notification-time">${n.time && n.time.toDate ? n.time.toDate().toLocaleString() : ""}</div>
      <button class="btn btn-sm btn-outline-light mt-2 mark-read-btn">Mark as read</button>
    `;
    // Nút mark as read
    div.querySelector(".mark-read-btn").onclick = async () => {
      await updateDoc(doc(db, "notifications", docSnap.id), { unread: false });
    };
    notificationsList.appendChild(div);
  });
});
