import { db, auth } from "./firebase-config.js";
import { doc, getDocs, addDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
const filmNameInput = document.getElementById('new-name');
const filmDescriptionInput = document.getElementById('new-description');
const filmImageInput = document.getElementById('new-image');
const filmForm = document.getElementById('create-film-form');
const filmList = document.getElementById('film-list');

// logout function 
const logout = document.getElementById('logout-btn');
logout.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        // Sign out the user
        if (confirm("Are you sure you want to log out?")) {
            // User confirmed logout
            await auth.signOut();
            alert("You have been logged out.");
            window.location.href = "./login.html"; // Redirect to login page
        }
    } catch (error) {
        console.error("Error signing out: ", error);
    }
});

const handleSubmit = async (e) => {
    e.preventDefault();

    const filmName = filmNameInput.value.trim();
    const filmDescription = filmDescriptionInput.value.trim();
    const filmImage = filmImageInput.value.trim();

    // Prevent adding if any field is blank
    if (!filmName || !filmDescription || !filmImage) {
        alert("Input all fields to create");
        return;
    }

    try {
        // Check if film with the same name already exists
        const filmsRef = collection(db, "films");
        const filmSnap = await getDocs(filmsRef);

        let isDuplicate = false;
        filmSnap.forEach(docSnap => {
            const filmData = docSnap.data();
            // If you have a uid field, check it here as well
            // Example: if (filmData.uid === someUid || filmData.name.toLowerCase() === filmName.toLowerCase())
            if (filmData.name && filmData.name.toLowerCase() === filmName.toLowerCase()) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            alert("A film with this name already exists.");
            return;
        }

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "films"), {
            name: filmName,
            description: filmDescription,
            image: filmImage
            // Add uid here if you have it
        });

        console.log("Document written with ID: ", docRef.id);

    } catch (error) {
        console.error('Error: ', error);
    }
}

filmForm.addEventListener('submit', handleSubmit);

// Function to render films
const renderFilmsRealtime = () => {
    const filmsRef = collection(db, "films");
    onSnapshot(filmsRef, (snapshot) => {
        filmList.innerHTML = ""; // Clear previous list

        snapshot.forEach(docSnap => {
            const filmData = docSnap.data();
            const filmId = docSnap.id;

            // Create film item
            const filmDiv = document.createElement('div');
            
            filmDiv.innerHTML = `
                <style>
                    
                </style>

                <div class="col-md-3 mb-3 d-flex">
                    <div class="card bg-black">
                    <img class="img-fluid" src="${filmData.image}" class="card-img-top img-fluid" alt="${filmData.name}">
                    <div class="card-body card-test">
                        <h4 class="card-title text-light card-title-test">${filmData.name}</h4>
                        <button type="button" class="btn btn-warning">
                            <a class="a-tag text-dark click-here" href="./info.html?id=${filmId}">Click here</a>
                        </button>
                        <button type="button" class="btn btn-success greenButton">
                            <a id="greenButton" class="a-tag text-light"><i class="fa-solid fa-heart"></i></a>
                        </button>
                        <button type="button" class="btn btn-danger watch-btn">
                            <a class="a-tag text-light" href="./watch.html?id=${filmId}"><i class="fa-solid fa-film"></i></a>
                        </button>    
                       </div>
                    </div>
                </div>`;
            
            filmList.appendChild(filmDiv);
        });

        // Add delete event listeners
        filmList.querySelectorAll('button[data-id]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.getAttribute('data-id');
                if (confirm("Are you sure you want to delete this film?")) {
                    await deleteDoc(doc(db, "films", id));
                    // No need to call renderFilmsRealtime() here, onSnapshot will auto-update
                }
            });
        });
    });
}

// Call the real-time render function when the page loads
renderFilmsRealtime();
