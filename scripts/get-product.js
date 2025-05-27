import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, addDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// const docRef = doc(db, "films", "R4MiXKfIkBTEuPCa2eBO");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
//   console.log("Document ID:", docSnap.id);
//   console.log("Document name:", docSnap.data().name);
// //   console.log("Document description:", docSnap.data().description); 
// //   console.log("Document image:", docSnap.data().image);
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }


// const q = query(collection(db, "films"), where("name", "==", "Cars 2"));
// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   const films = [];
//   querySnapshot.forEach((doc) => {
//       films.push(doc.id, doc.data().name, doc.data().image);
//   });
//   console.log("Cars 2 data:", films.join(", "));
// });

// Add a new document in collection "films"
// const docRef = await addDoc(collection(db, "films"), {
//     name: "Matrix",
//     description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
//     image: "https://www.imdb.com/title/tt0133093/mediaviewer/rm1737812993/?ref_=tt_ov_i"
// });

// Reference to the "films" collection
const filmsCollection = collection(db, "films");
const filmList = document.querySelector("#film-list");
// Listen for real-time updates
const unsub = onSnapshot(filmsCollection, (snapshot) => {
    snapshot.forEach((doc) => {
    const filmData = doc.data();
    filmList.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card bg-black">
          <img class="img-fluid" src="${filmData.image}" alt="${filmData.name}">
          <div class="card-body card-test">
            <h4 class="card-title text-light card-title-test">${filmData.name}</h4>
            <button type="button" class="btn btn-warning">
              <a class="a-tag" href="./info.html?id=${doc.id}">Click here</a>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}, (error) => {
  console.error("Error fetching films: ", error);
});