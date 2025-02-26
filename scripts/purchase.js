// document.addEventListener("DOMContentLoaded", () => {
//     const greenButton = document.getElementById("greenButton");

//     greenButton.addEventListener("click", () => {
//         cartCountLabel = document.getElementById("cartCount");
//         let count = 0;
//         greenButton.onclick = function() {
//             count++;
//             cartCountLabel.innerHTML = count;
//             alert("Item added to cart!");
//         };
        

//         alert("Item added to cart!");
//     });
// });



// document.addEventListener("DOMContentLoaded", function() {
//     const greenButton = document.getElementById("greenButton");

//     const cartCount = document.getElementById("cartCount");
//     let count = 0;
//     greenButton.onclick = function() {
//     count++;
//     cartCount.innerHTML = count;
//     alert("Item added to cart!");
// };

document.addEventListener("DOMContentLoaded", function () {
    // save film name, film price, film image, film id
    const greenButtons = document.getElementsByClassName("greenButton");
    const cartCountElement = document.getElementById("cartCount");
    let cartCount = 0;
    if (greenButtons) {
        for (let i = 0; i < greenButtons.length; i++) {
            greenButtons[i].addEventListener("click", function () {
                cartCount++;
                cartCountElement.innerHTML = cartCount;
                alert("Item added to cart!");

                // localStorage.setItem();
            });
        }
    } else {
        console.log("No green buttons found");
    }
});


// id = cartCount

// const decreaseBtn = document.getElementById("decreaseBtn");
// const resetBtn = document.getElementById("resetBtn");
// const increaseBtn = document.getElementById("increaseBtn");
// const countLabel = document.getElementById("countLabel");

// let count = 0;
// increaseBtn.onclick = function(){
//     count++;
//     countLabel.textContent = count;
// }

// decreaseBtn.onclick = function(){
//     count--;
//     countLabel.textContent = count;
// }

// resetBtn.onclick = function(){
//     count = 0;
//     countLabel.textContent = count;
// }