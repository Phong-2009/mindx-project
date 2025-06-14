import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { getFirestore, doc, getDoc, getDocs, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// const docRef = doc(db, "films", "R4MiXKfIkBTEuPCa2eBO");
// const docSnap = await getDoc(docRef);

const db = getFirestore(); // Initialize Firestore
document.addEventListener("DOMContentLoaded", async () => {
  const userConfirm = document.getElementById("user-confirm"); // Ensure this element exists in your HTML

  // Wait for the auth state to be ready
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in

      try {
        // Retrieve user data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();

          if (userData.role === "admin") {
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
            const logoutButton = document.getElementById("logout");
            if (logoutButton) {
              logoutButton.addEventListener("click", async () => {
                await auth.signOut();
                alert("You have been logged out.");
                userConfirm.innerHTML = `
                  <a id="user-confirm" class="nav-link p-2 bd-highlight custom-login-link" href="./login.html">LOGIN</a>
                  <a id="register" class="nav-link p-2 bd-highlight custom-login-link" href="./register.html">REGISTER</a>
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
      console.log("No user is signed in");
    }
  });
});

// Reference to the "films" collection
const filmCollection = collection(db, "films");

const filmList = document.querySelector("#basic-film-list");
function createFilmCard(filmsData) {
  return `
    <div class="col-md-3 d-flex justify-content-center">
      <div class="card bg-dark text-white mb-3" style="width: 200px; min-width:200px; height: 340px;">
        <img src="${filmsData.image}" class="card-img-top" alt="${filmsData.name}" style="height: 250px; object-fit: cover;">
        <div class="card-body p-2 d-flex flex-column justify-content-between">
          <h6 class="card-title mb-1" style="font-size: 1rem;">${filmsData.name}</h6>
          <button class="btn btn-warning click-here-btn" data-id="${filmsData.id}">
            <a href="${filmsData.link}" data-plan="${filmsData.plan}">Click here</a>
          </button>
        </div>
      </div>
    </div>
  `;
}

// onSnapshot(
//   filmCollection,
//   (snapshot) => {
//     if (snapshot.empty) {
//       console.log("No films found.");
//     } else {
//       snapshot.forEach((doc) => {
//         console.log("Film data:", doc.data().name, doc.data().plan);
//       });
//     }
//     const filmsArr = [];
//     snapshot.forEach((doc) => {
//       filmsArr.push(doc.data());
//     });

//     // Group films into arrays of 4
//     const groups = [];
//     for (let i = 0; i < filmsArr.length; i += 4) {
//       groups.push(filmsArr.slice(i, i + 4));
//     }

//     // Build carousel items
//     let carouselInner = '';
//     groups.forEach((group, idx) => {
//       carouselInner += `
//         <div class="carousel-item${idx === 0 ? ' active' : ''}">
//           <div class="row justify-content-center">
//             ${group.map(createFilmCard).join('')}
//           </div>
//         </div>
//       `;
//     });

//     // Render the carousel
//     filmList.innerHTML = `
//       <div id="filmsCarousel" class="carousel slide" data-bs-ride="carousel">
//         <div class="carousel-inner">
//           ${carouselInner}
//         </div>
//         <button class="carousel-control-prev custom-carousel-btn" type="button" data-bs-target="#filmsCarousel" data-bs-slide="prev">
//           <span class="carousel-control-prev-icon"></span>
//         </button>
//         <button class="carousel-control-next custom-carousel-btn" type="button" data-bs-target="#filmsCarousel" data-bs-slide="next">
//           <span class="carousel-control-next-icon"></span>
//         </button>
//       </div>
//     `;
//   },
//   (error) => {
//     console.error("Error fetching films: ", error);
//   }
// );

onSnapshot(collection(db, "films"), (snapshot) => {
  const basicFilms = [];
  const premiumFilms = [];
  snapshot.forEach((doc) => {
    const film = { ...doc.data(), id: doc.id, link: doc.link }; // Thêm id vào object phim
    if (film.plan === "basic") {
      basicFilms.push(film);
    } else if (film.plan === "premium") {
      premiumFilms.push(film);
    }
  });

  // Render basicFilms vào #basic-film-list
  renderCarousel(basicFilms, "basic-film-list");
  // Render premiumFilms vào #premium-film-list
  renderCarousel(premiumFilms, "premium-film-list");
});

function renderCarousel(films, containerId) {
  const groups = [];
  for (let i = 0; i < films.length; i += 4) {
    groups.push(films.slice(i, i + 4));
  }
  let carouselInner = "";
  groups.forEach((group, idx) => {
    carouselInner += `
      <div class="carousel-item${idx === 0 ? " active" : ""}">
        <div class="row justify-content-center">
          ${group.map(createFilmCard).join("")}
        </div>
      </div>
    `;
  });
  document.getElementById(containerId).innerHTML = carouselInner;
}

document.addEventListener("click", async function (e) {
  const btn = e.target.closest(".click-here-btn");
  if (!btn) return;

  e.preventDefault();

  // Lấy user hiện tại
  const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!userDoc.exists()) {
    alert("Please login to view this film.");
    window.location.href = "./login.html";
    return;
  }

  const userSubscription = userDoc.data().subscription;

  // Lấy id phim từ data-id của nút vừa click
  const filmId = btn.getAttribute("data-id");
  console.log("Film ID:", filmId);
  if (!filmId) {
    alert("Film ID not found!");
    return;
  }

  const filmDoc = await getDoc(doc(filmCollection, filmId));
  if (!filmDoc.exists()) {
    console.error("No film data found.");
    return;
  } else {
    console.log("Film data:", filmDoc.data().name, filmDoc.data().plan);
    const filmData = filmDoc.data();
    console.log("Film data:");

  if (userSubscription != filmData.plan) {
    alert("Your subscription does not allow you to view this film. Please upgrade your plan.");
    return;
  }
    // chuyển hướng sang trang phim
    window.location.href = `${filmData.link}`;
  }
});
