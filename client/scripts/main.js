// $(document).ready(function () {
  
//   $('#bootstrapCarousel1').carousel({
//     interval: 2000, 
//     wrap: true // Enables continuous cycling
//   });

//   // Section 2: Bootstrap multi-item carousel setup
//   $('#multiItemCarousel').carousel({
//     interval: false // Disable automatic cycling
//   });

//   // For every slide in carousel, copy the next slide's item in the slide
//   $('#multiItemCarousel .carousel-item').each(function () {
//     var next = $(this).next();
//     if (!next.length) {
//       next = $(this).siblings(':first');
//     }
//     next.children(':first-child').clone().appendTo($(this));

//     if (next.next().length > 0) {
//       next.next().children(':first-child').clone().appendTo($(this));
//     } else {
//       $(this)
//         .siblings(':first')
//         .children(':first-child')
//         .clone()
//         .appendTo($(this));
//     }
//   });

//   // Section 3: Bootstrap Carousel with buttons for 2025 movies
//   $('#carouselExampleIndicators2').carousel({
//     interval: 3000, // 3 seconds between slides
//     wrap: true // Enables continuous cycling
//   });

//   // Handle the next and previous button clicks
//   $('.btn-warning[data-slide="prev"]').click(function () {
//     $('#carouselExampleIndicators2').carousel('prev');
//   });

//   $('.btn-warning[data-slide="next"]').click(function () {
//     $('#carouselExampleIndicators2').carousel('next');
//   });
// });



// // let users = JSON.parse(localStorage.getItem('users')) || [];
// //     let login = document.querySelector('.login');
// //     for (let i = 0; i < users.length; i++) {
// //         login.innerHTML += `<p>LOGOUT</p>`;
// //         login.innerHTML = login.innerHTML.replace('LOGIN', 'LOGOUT');
// //     }



document.addEventListener('DOMContentLoaded', checkLoginStatus);

function checkLoginStatus() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userInfo = document.getElementById('user-info');

    if (loggedInUser) {
        userInfo.innerHTML = `
            <a class="nav-link p-2 bd-highlight custom-login-link" href="#" onclick="logout()">
                ${loggedInUser} <span class="btn btn-sm ms-2" style="color: #fff; font-weight: bold">LOGOUT</span>
            </a>
        `;
    } else {
        userInfo.innerHTML = `
            <a class="nav-link p-2 bd-highlight custom-login-link" style="font-weight: bold;" href="./login.html">LOGIN</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    checkLoginStatus();
    alert("You have been logged out.");
}
