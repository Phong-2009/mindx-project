import { TMDB_API_KEY } from "./config.js";
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
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
          console.log("User data retrieved from Firestore:", userData.email);

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
    }
  });
});

(async () => {
  const HomeAPIRoutes = {
    "Trending Movies": { url: "/trending/movie/week" },
    "Popular Movies": { url: "/movie/popular" },
    "Top Rated Movies": { url: "/movie/top_rated" },
    "Now Playing at Theatres": { url: "/movie/now_playing" },
    "Upcoming Movies": { url: "/movie/upcoming" },
  };

  const promises = await Promise.all(
    Object.keys(HomeAPIRoutes).map(
      async (item) =>
        await (
          await fetch(
            `https://api.themoviedb.org/3${HomeAPIRoutes[item].url}?api_key=${TMDB_API_KEY}`
          )
        ).json()
    )
  );

  const data = promises.reduce((final, current, index) => {
    final[Object.keys(HomeAPIRoutes)[index]] = current.results;
    return final;
  }, {});

  const trending = data["Trending Movies"];

  const main = trending[new Date().getDate() % trending.length];

  document.querySelector(
    "#hero-image"
  ).src = `https://image.tmdb.org/t/p/original${main.backdrop_path}`;
  document.querySelector(
    "#hero-preview-image"
  ).src = `https://image.tmdb.org/t/p/w300${main.poster_path}`;
  document.querySelector("#hero-title").innerText = main.title || main.name;
  document.querySelector("#hero-description").innerText = main.overview;
  document.querySelector("#watch-now-btn").href = `./watch.html?id=${main.id}`;
  document.querySelector("#view-info-btn").href = `./info.html?id=${main.id}`;

  Object.keys(data).map((key, index) => {
    const container = document.querySelector("#api_container");

    // Carousel ID
    const carouselId = `carouselExampleIndicators2_${index}`;

    container.innerHTML += `
     <div class="row">
       <div class="col-6">
           <h3 style="color: #fff;" class="mb-4">2024 ${key}</h3>
       </div>
       <div class="col-12">
           <div id="${carouselId}" class="carousel slide" data-ride="carousel">
               <div class="carousel-inner" id="carousel_inner_${index}">
               </div>
           </div>
       </div>
   </div>
   
   <div class="row">
    <div class="col-12 text-center mt-2">
        <a class="btn btn-primary btn-lg mb-3 mx-1" href="#${carouselId}" role="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <i class="fa fa-arrow-left"></i>
        </a>
        <a class="btn btn-primary btn-lg mb-3 mx-1" href="#${carouselId}" role="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <i class="fa fa-arrow-right"></i>
        </a>
    </div>
</div>
   `;

    const carouselInner = document.querySelector(`#carousel_inner_${index}`);

    // Split items into groups of 4
    const chunkSize = 4;
    for (let i = 0; i < data[key].length; i += chunkSize) {
      let chunk = data[key].slice(i, i + chunkSize);
      let isActive = i === 0 ? "active" : ""; // First group should be active

      let slideHTML = `
            <div class="carousel-item ${isActive}">
                <div class="row" id="api_row_${index}_${i}">`;

      // Append each item inside the chunk
      chunk.forEach(item => {
        slideHTML += `
          <div class="col-md-3 mb-3">
              <div class="card bg-black">
            <img class="img-fluid" src="https://image.tmdb.org/t/p/w200${item.poster_path}" class="card-img-top img-fluid" alt="${item.title || item.name}">
            <div class="card-body card-test">
                <h4 class="card-title text-light card-title-test">${item.title || item.name}</h4>
                <button type="button" class="btn btn-warning">
                  <a class="a-tag text-dark click-here" href="./info.html?id=${item.id}">Click here</a>
                </button>
                <button type="button" class="btn btn-success greenButton">
                  <a id="greenButton" class="a-tag text-light"><i class="fa-solid fa-heart"></i></a>
                </button>
                <button type="button" class="btn btn-danger watch-btn">
                  <a class="a-tag text-light" href="./watch.html?id=${item.id}"><i class="fa-solid fa-film"></i></a>
                </button>    
            </div>
              </div>
          </div>`;
      });

      slideHTML += `</div></div>`;
      carouselInner.innerHTML += slideHTML;
    }
    // Add event listeners for search button
    const searchButton = document.getElementById("search-button");
    if (searchButton.length > 0) {
      for (let i = 0; i < clickHereButtons.length; i++) {
        clickHereButtons[i].addEventListener("click", function () {
          // Check if the user is logged in
          onAuthStateChanged(auth, (user) => {
            if (user) {
              //  User is logged in
              console.log("Logged in as:", user.email);
            } else {
              // Not logged in
              alert("You need to log in to view film details.");
              window.location.href = "./login.html";
            }
          });
        });
      }
    }
    // Add evevnt listeners for click here buttons
    const watchButtons = document.getElementsByClassName("watch-btn");
    if (watchButtons.length > 0) {
      for (let i = 0; i < watchButtons.length; i++) {
        watchButtons[i].addEventListener("click", function () {
          // Check if the user is logged in
          onAuthStateChanged(auth, (user) => {
            if (user) {
              //  User is logged in
              console.log("Logged in as:", user.email);
            } else {
              // Not logged in
              alert("You need to log in to view film details.");
              window.location.href = "./login.html";
            }
          });
        });
      }
    }

    

    // Add event listeners for green buttons
    // const greenButtons = document.getElementsByClassName("greenButton");
    // const cartCountElement = document.getElementById("cartCount");
    // let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
    // cartCountElement.innerHTML = cartCount;
    //     if (greenButtons.length > 0) {
    //       for (let i = 0; i < greenButtons.length; i++) {
    //         greenButtons[i].addEventListener("click", function () {
    //           // Check if the user is logged in
    //           const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    //           onAuthStateChanged(auth, (user) => {
    //             if (user) {
    //               //  User is logged in
    //               console.log("Logged in as:", user.email);
    //             } else {
    //               // Not logged in
    //               alert("You need to log in to view film details.");
    //               window.location.href = "./login.html";
    //             }
    //           });

    //           const filmCard = greenButtons[i].closest('.card');
    //           const filmTitle = filmCard.querySelector('.card-title').innerText;
    //           const filmDescription = filmCard.querySelector('.card-description') ? filmCard.querySelector('.card-description').innerText : '';
    //           const filmImage = filmCard.querySelector('img').src;
    //           const filmId = filmCard.querySelector('a.a-tag').href.split('id=')[1];

    //           const film = {
    //             id: filmId,
    //             title: filmTitle,
    //             description: filmDescription,
    //             image: filmImage
    //           };

    //           // Check if the film is already selected
    //           let selectedFilms = JSON.parse(localStorage.getItem('selectedFilms')) || [];
    //           const filmExists = selectedFilms.some(f => f.id === filmId);

    //           if (filmExists) {
    //             alert("This film is already in your wishlist!");
    //           } else {
    //             // Save film details to localStorage
    //             selectedFilms.push(film);
    //             localStorage.setItem('selectedFilms', JSON.stringify(selectedFilms));

    //             cartCount++;
    //             localStorage.setItem('cartCount', JSON.stringify(cartCount));
    //             cartCountElement.innerHTML = cartCount;
    //             alert("You have selected a film for later!");
    //           }
    //         });
    //       }
    //     } else {
    //       console.log("No green buttons found");
    //     }
  });
})();