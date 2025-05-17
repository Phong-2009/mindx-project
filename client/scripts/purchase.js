import { auth } from './firebase-config.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

const db = getFirestore();

document.addEventListener('DOMContentLoaded', async () => {
  const userConfirm = document.getElementById('user-confirm'); // Ensure this element exists in your HTML

  // Wait for the auth state to be ready
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user);

      try {
        // Retrieve user data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("User data retrieved from Firestore:", userData);

          // Update the UI with user data
          if (userConfirm) {
            userConfirm.innerHTML = `
              <a id="username" class="nav-link p-2 bd-highlight custom-login-link" href="#">${userData.firstName} ${userData.lastName}</a>
              <a id="logout" class="nav-link p-2 bd-highlight custom-login-link" href="#">LOGOUT</a>
            `;

            // Add logout functionality
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
              logoutButton.addEventListener('click', async () => {
                await auth.signOut();
                alert("You have been logged out.");
                window.location.href = "login.html"; // Redirect to login page
              });
            }
          }
        } else {
          console.log("No user data found in Firestore.");
        }
      } catch (error) {
        console.error("Error retrieving user data from Firestore:", error);
      }
    } else {
      // No user is signed in
      console.log('No user is signed in');
      window.location.href = "login.html"; // Redirect to login page
    }
  });
});


//let n = 100;
// let i = 10;

// while (n >= i) {
//     n -= i;
//     console.log(n);
//     if (n == 0) {
//         break;
//     }
// }