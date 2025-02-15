import { TMDB_API_KEY } from "./config.js";

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

  fetch(`https://api.themoviedb.org/3${HomeAPIRoutes["Trending Movies"].url}?api_key=${TMDB_API_KEY}`)
  .then((response) => response.json())
  .then(data => console.log(data));

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
    document.querySelector("#api_row").innerHTML += /*html*/ `    
    <div class="section">
      <h2 style="color: #fff;">${key}</h2>

      <div class="swiper-${index} swiper">
        <div class="swiper-wrapper">
          ${data[key]
            .map(
              (item) => /*html*/ `
          
              <div class="col-md-3 mb-3">
            <div class="card bg-dark">
              <img class="img-fluid" src="https://image.tmdb.org/t/p/w200${item.poster_path}" class="card-img-top img-fluid" alt="${item.title || item.name}">
              <div class="card-body bg-black">
                <h4 class="card-title text-light">${item.title || item.name}</h4>
                <button type="button" class="btn btn-warning">
                  <a class="a-tag" href="./info.html?id=${item.id}">Click here</a>
                </button>
              </div>
            </div>
          </div>
        `
            )
            .join("\n")} 
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
    `;
});


  document.querySelector(".backdrop").classList.add("backdrop-hidden");

  Object.keys(data).map((key, index) => {
    new Swiper(`.swiper-${index}`, {
      spaceBetween: 30,
      autoplay: { delay: 5000, disableOnInteraction: true },
      slidesPerView: "auto",
      loop: true,
      slidesPerGroupAuto: true,
      navigation: {
        prevEl: `.swiper-button-prev`,
        nextEl: `.swiper-button-next`,
      },
    });
  });
})();

