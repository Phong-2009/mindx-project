document.addEventListener("DOMContentLoaded", function () {
    // save film name, film description, film image
    const greenButtons = document.getElementsByClassName("greenButton");
    const cartCountElement = document.getElementById("cartCount");
    let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
    cartCountElement.innerHTML = cartCount;

    if (greenButtons.length > 0) {
        for (let i = 0; i < greenButtons.length; i++) {
            greenButtons[i].addEventListener("click", function () {
                const filmCard = greenButtons[i].closest('.card');
                const filmTitle = filmCard.querySelector('.card-title').innerText;
                const filmDescription = filmCard.querySelector('.card-description').innerText;
                const filmImage = filmCard.querySelector('img').src;

                const film = {
                    title: filmTitle,
                    description: filmDescription,
                    image: filmImage
                };

                // Save film details to localStorage
                let selectedFilms = JSON.parse(localStorage.getItem('selectedFilms')) || [];
                selectedFilms.push(film);
                localStorage.setItem('selectedFilms', JSON.stringify(selectedFilms));

                cartCount++;
                localStorage.setItem('cartCount', JSON.stringify(cartCount));
                cartCountElement.innerHTML = cartCount;
                alert("You have selected a film for later!");
            });
        }
    } else {
        console.log("No green buttons found");
    }
});