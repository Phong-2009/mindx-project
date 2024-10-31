$(document).ready(function () {
  // Section 1: Bootstrap Carousel (no Slick, Bootstrap only)
  $('#bootstrapCarousel1').carousel({
    interval: 2000, // 2 seconds between slides
    wrap: true // Enables continuous cycling
  });

  // Section 2: Bootstrap multi-item carousel setup
  $('#multiItemCarousel').carousel({
    interval: false // Disable automatic cycling
  });

  // For every slide in carousel, copy the next slide's item in the slide
  $('#multiItemCarousel .carousel-item').each(function () {
    var next = $(this).next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    if (next.next().length > 0) {
      next.next().children(':first-child').clone().appendTo($(this));
    } else {
      $(this)
        .siblings(':first')
        .children(':first-child')
        .clone()
        .appendTo($(this));
    }
  });

  // Section 3: Bootstrap Carousel with buttons for 2025 movies
  $('#carouselExampleIndicators2').carousel({
    interval: 3000, // 3 seconds between slides
    wrap: true // Enables continuous cycling
  });

  // Handle the next and previous button clicks
  $('.btn-warning[data-slide="prev"]').click(function () {
    $('#carouselExampleIndicators2').carousel('prev');
  });

  $('.btn-warning[data-slide="next"]').click(function () {
    $('#carouselExampleIndicators2').carousel('next');
  });
});



// let users = JSON.parse(localStorage.getItem('users')) || [];
//     let login = document.querySelector('.login');
//     for (let i = 0; i < users.length; i++) {
//         login.innerHTML += `<p>LOGOUT</p>`;
//         login.innerHTML = login.innerHTML.replace('LOGIN', 'LOGOUT');
//     }

