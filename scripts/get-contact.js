import { getFirestore, collection, getDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Check if user is logged in and is an admin
const auth = getAuth();
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
const db = getFirestore();
const commentsList = document.getElementById('comments-list');
const noComment = document.getElementById('no-comment');

async function loadAllComments() {
  commentsList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "comments"));

  if (querySnapshot.empty) {
    noComment.style.display = "block";
    return;
  }
  noComment.style.display = "none";
  querySnapshot.forEach(docSnap => {
    const c = docSnap.data();
    const div = document.createElement('div');
    div.className = "comment-item";
    div.innerHTML = `
      <div class="comment-user"><i class="fa fa-user-circle me-1"></i>${c.name} (${c.email})</div>
      <div class="comment-message">${c.message}</div>
      <div class="comment-time">${c.time && c.time.toDate ? c.time.toDate().toLocaleString() : ""}</div>
      <div class="comment-actions">
        <button class="btn btn-danger btn-action btn-sm">Delete</button>
      </div>
    `;
    div.querySelector('.btn-danger').onclick = async () => {
      if (confirm('Delete this comment?')) {
        await deleteDoc(doc(db, "comments", docSnap.id));
        div.remove();
      }
    };
    commentsList.appendChild(div);
  });
}

loadAllComments();