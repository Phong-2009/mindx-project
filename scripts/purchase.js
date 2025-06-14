import { auth } from "./firebase-config.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
const db = getFirestore();

document.addEventListener("DOMContentLoaded", async () => {
  const userConfirm = document.getElementById("user-confirm"); // Ensure this element exists in your HTML

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
          console.log("User data retrieved from Firestore:", userData.email);

          const balanceNumber = document.querySelector(".current-balance");
          if (balanceNumber) {
            balanceNumber.textContent = `Current balance: ${userData.balance !== undefined ? userData.balance : 0}$`;
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
            const logoutButton = document.getElementById("logout");
            if (logoutButton) {
              logoutButton.addEventListener("click", async () => {
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
      console.log("No user is signed in");
      window.location.href = "login.html"; // Redirect to login page
    }
  });
});

const balanceForm = document.getElementById("balance-form");

const handlePurchase = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  try {
    if (user) {
      const balance = doc(db, "users", user.uid);
      const balanceSnapshot = await getDoc(balance);
      if (balanceSnapshot.exists()) {
        const currentBalance = Number(balanceSnapshot.data().balance) || 0;
        const updateBalanceValue = document.getElementById("update-balance").value;
        const updateBalance = Number.parseFloat(updateBalanceValue);
        if (isNaN(updateBalance)) {
          alert("Please enter a valid number to update the balance.");
          return;
        }
        const newBalance = currentBalance + updateBalance;
        await updateDoc(balance, { balance: newBalance });
        const userData = balanceSnapshot.data();
        console.log(`User ${userData.firstName} ${userData.lastName} new balance:`, newBalance);

        // Cập nhật số dư hiển thị ngay lập tức
        const balanceNumber = document.querySelector(".balance-number");
        if (balanceNumber) {
          balanceNumber.textContent = newBalance;
        }
        document.getElementById("update-balance").value = ""; // Reset ô nhập tiền
        const updateBalanceOutput = document.getElementById("update-balance-output");
        updateBalanceOutput.textContent = `Your balance has been updated to: ${newBalance.toString()}$`;
      } else {
        console.log("No balance data found.");
      }
    }
  } catch (error) {
    console.error("Error updating balance:", error);
    alert("Error updating balance: " + error.message);
  }
};
balanceForm.addEventListener("submit", handlePurchase);
