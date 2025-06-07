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
const basicSubscription = document.getElementById('basic');
const standardSubscription = document.getElementById('standard');
const premiumSubscription = document.getElementById('premium');

// basic subscription
const handleBasicSubscription = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to subscribe.");
    return;
  }

  try {
    const balanceDocRef = doc(db, "users", user.uid);
    const balanceDocSnap = await getDoc(balanceDocRef);
    let userBalance = 0;
    if (balanceDocSnap.exists()) {
      const balanceData = balanceDocSnap.data();
      userBalance = balanceData.balance || 0;
      console.log("User balance from Firestore:", userBalance);
    }
    if (userBalance < 4.99) {
      alert("You do not have enough balance to subscribe to the Basic plan. Please add funds to your account.");
      window.location.href = "./purchase.html";
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();


      if (userData.subscription === 'basic') {
        alert("You are already subscribed to the Basic plan.");
        userBalance -= 4.99;
        await updateDoc(balanceDocRef, { balance: userBalance });
        console.log("User balance after subscription:", userBalance);
        return;
      }

      await updateDoc(userDocRef, { subscription: 'basic' });
      alert("You have successfully subscribed to the Basic plan.");
    } else {
      console.error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error subscribing to Basic plan:", error);
  }
};

const handleStandardSubscription = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to subscribe.");
    return;
  }

  try {
    const balanceDocRef = doc(db, "users", user.uid);
    const balanceDocSnap = await getDoc(balanceDocRef);
    let userBalance = 0;
    if (balanceDocSnap.exists()) {
      const balanceData = balanceDocSnap.data();
      userBalance = balanceData.balance || 0;
      console.log("User balance from Firestore:", userBalance);
    }
    if (userBalance < 9.99) {
      alert("You do not have enough balance to subscribe to the Standard plan. Please add funds to your account.");
      window.location.href = "./purchase.html";
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.subscription === 'standard') {
        alert("You are already subscribed to the Standard plan.");
        userBalance -= 9.99;
        await updateDoc(balanceDocRef, { balance: userBalance });
        console.log("User balance after subscription:", userBalance);
        return;
      }
      await updateDoc(userDocRef, { subscription: 'standard' });
      userBalance -= 9.99;
      await updateDoc(balanceDocRef, { balance: userBalance });
      alert("You have successfully subscribed to the Standard plan.");
    } else {
      console.error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error subscribing to Standard plan:", error);
  }
};

const handlePremiumSubscription = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to subscribe.");
    return;
  }

  try {
    const balanceDocRef = doc(db, "users", user.uid);
    const balanceDocSnap = await getDoc(balanceDocRef);
    let userBalance = 0;
    if (balanceDocSnap.exists()) {
      const balanceData = balanceDocSnap.data();
      userBalance = balanceData.balance || 0;
      console.log("User balance from Firestore:", userBalance);
    }
    if (userBalance < 19.99) {
      alert("You do not have enough balance to subscribe to the Premium plan. Please add funds to your account.");
      window.location.href = "./purchase.html";
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.subscription === 'premium') {
        alert("You are already subscribed to the Premium plan.");
        userBalance -= 19.99;
        await updateDoc(balanceDocRef, { balance: userBalance });
        console.log("User balance after subscription:", userBalance);
        return;
      }
      await updateDoc(userDocRef, { subscription: 'premium' });
      userBalance -= 19.99;
      await updateDoc(balanceDocRef, { balance: userBalance });
      alert("You have successfully subscribed to the Premium plan.");
    } else {
      console.error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error subscribing to Premium plan:", error);
  }
};

basicSubscription.addEventListener('click', handleBasicSubscription);
standardSubscription.addEventListener('click', handleStandardSubscription);
premiumSubscription.addEventListener('click', handlePremiumSubscription);
