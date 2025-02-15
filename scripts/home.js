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
  // .then(data => console.log(data));

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
    <div class="col-12 text-center mt-5">
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
                    <div class="card bg-dark">
                        <img class="img-fluid" src="https://image.tmdb.org/t/p/w200${item.poster_path}" class="card-img-top img-fluid" alt="${item.title || item.name}">
                        <div class="card-body bg-black">
                            <h4 class="card-title text-light">${item.title || item.name}</h4>
                            <button type="button" class="btn btn-warning">
                                <a class="a-tag text-dark" href="./detail1.html">Click here</a>
                            </button>
                        </div>
                    </div>
                </div>`;
      });

      slideHTML += `</div></div>`;
      carouselInner.innerHTML += slideHTML;
    }
  });
})();

