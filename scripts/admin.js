import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, getDocs, addDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


const filmNameInput = document.getElementById('new-name');
const filmDescriptionInput = document.getElementById('new-description');
const filmImageInput = document.getElementById('new-image');
const filmLinkInput = document.getElementById('new-link'); 
const filmWatchLinkInput = document.getElementById('new-watch-link');
const filmPlanInput = document.getElementById('new-plan'); 
const filmForm = document.getElementById('create-film-form');
const filmList = document.getElementById('film-list');
const db = getFirestore();

// Check if user is logged in and is an admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists() || userSnap.data().role !== "admin") {
    window.location.href = "./login.html";
    return;
  }
  // User is admin, allow access
});

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
    const filmLink = filmLinkInput.value.trim();
    const filmWatchLink = filmWatchLinkInput.value.trim();
    const filmPlan = filmPlanInput.value.trim();


    // Prevent adding if any field is blank
    if (!filmName || !filmDescription || !filmImage || !filmLink || !filmWatchLink || !filmPlan) {
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
            image: filmImage,
            link: filmLink,
            watchLink: filmWatchLink, // Add watch link
            plan: filmPlan
            // Add uid here if you have it
        });
        alert("Film created successfully!");
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
            filmDiv.className = "col-md-3 mb-3 d-flex"; // <-- Đặt class col-md-3 ở đây

            filmDiv.innerHTML = `
                <div class="card bg-black w-100 h-100 d-flex flex-column align-items-center">
                    <img class="img-fluid mx-auto d-block" src="${filmData.image}" alt="${filmData.name}" style="height:340px; object-fit:cover; width:100%;">
                    <div class="card-body card-test d-flex flex-column justify-content-between align-items-center w-100">
                        <h4 class="card-title text-light card-title-test text-center mb-3" style="min-height:48px">${filmData.name}</h4>
                        <div class="d-flex justify-content-center gap-2 w-100">
                            <button type="button" class="btn btn-primary edit-film-btn" data-id="${filmId}">
                                <i class="fa fa-edit"></i> Edit
                            </button>
                            <button type="button" class="btn btn-danger delete-film-btn" film-data-id="${filmId}">
                                <i class="fa fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
        `;

            filmList.appendChild(filmDiv);
        });
        // Add delete buttons
        const deleteButtons = document.querySelectorAll('.delete-film-btn');
        // Add delete event listeners
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('film-data-id');
                if (confirm("Are you sure you want to delete this film?")) {
                    await deleteDoc(doc(db, "films", id));
                    // No need to call renderFilmsRealtime() here, onSnapshot will auto-update
                }
            });
        });
    });
}
renderFilmsRealtime();

document.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-film-btn');
    if (editBtn) {
        const filmId = editBtn.getAttribute('data-id');
        const filmDocRef = doc(db, "films", filmId);
        const filmDocSnap = await getDoc(filmDocRef);
        if (filmDocSnap.exists()) {
            const film = filmDocSnap.data();
            document.getElementById('edit-id').value = filmId;
            document.getElementById('edit-name').value = film.name;
            document.getElementById('edit-description').value = film.description;
            document.getElementById('edit-image').value = film.image;
            document.getElementById('edit-link').value = film.link;
            document.getElementById('edit-watch-link').value = film.watchLink; // Set watch link
            document.getElementById('edit-plan').value = film.plan;
            // Hiện modal
            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show();
        }
    }
});

// Xử lý cập nhật film khi submit form
document.getElementById('edit-film-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const filmId = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const description = document.getElementById('edit-description').value.trim();
    const image = document.getElementById('edit-image').value.trim();
    const link = document.getElementById('edit-link').value.trim();
    const watchLink = document.getElementById('edit-watch-link').value.trim(); // Lấy watch link
    const plan = document.getElementById('edit-plan').value.trim();
    if (!name || !description || !image || !link || !watchLink || !plan) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const filmDocRef = doc(db, "films", filmId);
        await updateDoc(filmDocRef, { name, description, image, link, watchLink });
        // Đóng modal
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        alert("Film updated successfully!");
    } catch (err) {
        alert("Error updating film: " + err.message);
    }
});

