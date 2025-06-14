import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';





// Check if the user is logged in
document.addEventListener('DOMContentLoaded', async () => {
  const userConfirm = document.getElementById('user-confirm'); // Ensure this element exists in your HTML

  // Wait for the auth state to be ready
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      // Read user balance from Firestore
      const balanceDocRef = doc(db, "users", user.uid);
      const balanceDocSnap = await getDoc(balanceDocRef);
      let userBalance = 0;
      if (balanceDocSnap.exists()) {
        const balanceData = balanceDocSnap.data();
        userBalance = balanceData.balance || 0;
        console.log("User balance from Firestore:", userBalance);
      }

      try {
        // Retrieve user data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("User data retrieved from Firestore:", userData.email);

          if (userData.role === 'admin') {
            // Redirect admin to admin page
            window.location.href = "./admin.html";
          }

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
      console.log('No user is signed in');
    }
  });
});
const premiumSubscription = document.getElementById('premium');


const handlePremiumSubscription = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to subscribe.");
    return;
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User document does not exist.");
      return;
    }

    const userData = userDocSnap.data();
    const currentPlan = userData.subscription || "free";
    let userBalance = userData.balance || 0;

    if (currentPlan === "premium") {
      alert("You are already subscribed to the Premium plan.");
      return;
    }

    if (userBalance < 14.99) {
      alert("You do not have enough balance to subscribe to the Premium plan. Please add funds to your account.");
      window.location.href = "./purchase.html";
      return;
    }

    // Trừ tiền và cập nhật gói
    await updateDoc(userDocRef, {
      subscription: "premium",
      balance: userBalance - 14.99
    });
    alert("You have successfully subscribed to the Premium plan.");
  } catch (error) {
    console.error("Error subscribing to Premium plan:", error);
  }
};

const cancelSubscription = document.getElementById('cancel-subscription');
const handleCancelSubscription = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to cancel your subscription.");
    return;
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User document does not exist.");
      return;
    }

    const userData = userDocSnap.data();
    const currentPlan = userData.subscription || "free";

    if (currentPlan !== "premium") {
      alert("You are not subscribed to the Premium plan.");
      return;
    }

    // Cập nhật gói về free
    await updateDoc(userDocRef, {
      subscription: "basic"
    });
    alert("Your Premium subscription has been cancelled.");
  } catch (error) {
    console.error("Error cancelling Premium subscription:", error);
  }
};
premiumSubscription.addEventListener('click', handlePremiumSubscription);
cancelSubscription.addEventListener('click', handleCancelSubscription);