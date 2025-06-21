import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc, addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

const db = getFirestore();

document.addEventListener('DOMContentLoaded', async () => {
  const userConfirm = document.getElementById('user-confirm'); // Ensure this element exists in your HTML

  // Wait for the auth state to be ready
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user);

      try {
        // Retrieve user data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("User data retrieved from Firestore:", userData.email);

          // Update the UI with user data
          if (userConfirm) {
            userConfirm.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <a id="username" class="nav-link p-2 bd-highlight custom-login-link" href="#">${userData.firstName} ${userData.lastName}</a>
                <a id="logout" class="nav-link p-2 bd-highlight custom-login-link" href="#">LOGOUT</a>
              </div>
            `;

            // Add logout functionality
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
              logoutButton.addEventListener('click', async () => {
                await auth.signOut();
                alert("You have been logged out.");
                userConfirm.innerHTML = `
                  <a id="user-confirm" class="nav-link p-2 bd-highlight custom-login-link" href="./login.html">LOGIN</a>
                `; // Clear user info
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
      window.location.href = "./login.html"; // Redirect to login page
    }
  });
});
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Khi gửi comment:
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = document.getElementById('message').value.trim();
        if (!message) {
          alert("Please fill in all fields.");
          return;
        }
        try {
          await addDoc(collection(db, "comments"), {
            name: userData.firstName + " " + userData.lastName,
            email: userData.email,
            message,
            time: serverTimestamp()
          });
          alert("Your message has been sent successfully!");
          contactForm.reset();
        } catch (error) {
          alert("There was an error sending your message. Please try again later.");
        }
      });
    }
  }
});
// contact the admin
const contactForm = document.getElementById('contact-form');
if (contactForm) {  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value.trim();

    if (!message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Here you would typically send the message to your server or admin email
        await addDoc(collection(db, "comments"), {
          message,
          time: serverTimestamp() // Add a timestamp
        });
      alert("Your message has been sent successfully!");
      contactForm.reset(); // Clear the form
    } catch (error) {
      console.error("Error sending contact form:", error);
      alert("There was an error sending your message. Please try again later.");
    }
  });
}