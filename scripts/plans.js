import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
const db = getFirestore();
const plansCol = collection(db, "plans");
onSnapshot(plansCol, (snapshot) => {
  // Render lại danh sách gói đăng ký mỗi khi có thay đổi trên Firestore
  const plans = [];
  snapshot.forEach(doc => plans.push({ ...doc.data(), id: doc.id }));
  renderPlansToUI(plans); // Hàm này bạn tự định nghĩa để cập nhật UI
});
const plansTableBody = document.getElementById("plans-table-body");
const addPlanForm = document.getElementById("add-plan-form");
const editPlanForm = document.getElementById("edit-plan-form");

let plansCache = [];

// Render plans to table
async function renderPlans() {
  plansTableBody.innerHTML = "";
  const snapshot = await getDocs(plansCol);
  plansCache = [];
  snapshot.forEach(docSnap => {
    const plan = { ...docSnap.data(), id: docSnap.id };
    plansCache.push(plan);
    plansTableBody.innerHTML += `
      <tr>
        <td>${plan.name}</td>
        <td>$${Number(plan.price).toFixed(2)}</td>
        <td>${plan.description}</td>
        <td>${plan.features.split(",").map(f => `<span class="badge bg-secondary me-1">${f.trim()}</span>`).join(" ")}</td>
        <td>
          <button class="btn btn-sm btn-info me-1 edit-plan-btn" data-id="${plan.id}"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-danger delete-plan-btn" data-id="${plan.id}"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
  attachActionEvents();
}

// Attach edit/delete events
function attachActionEvents() {
  document.querySelectorAll(".edit-plan-btn").forEach(btn => {
    btn.onclick = () => {
      const plan = plansCache.find(p => p.id === btn.dataset.id);
      if (plan) {
        editPlanForm.planId.value = plan.id;
        editPlanForm.name.value = plan.name;
        editPlanForm.price.value = plan.price;
        editPlanForm.description.value = plan.description;
        editPlanForm.features.value = plan.features;
        new bootstrap.Modal(document.getElementById("editPlanModal")).show();
      }
    };
  });
  document.querySelectorAll(".delete-plan-btn").forEach(btn => {
    btn.onclick = async () => {
      if (confirm("Are you sure you want to delete this plan?")) {
        await deleteDoc(doc(db, "plans", btn.dataset.id));
        await renderPlans();
        // Notify subscription page to update
        window.localStorage.setItem("plans_updated", Date.now());
      }
    };
  });
}

// Add Plan
addPlanForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  await addDoc(plansCol, {
    name: form.name.value,
    price: Number(form.price.value),
    description: form.description.value,
    features: form.features.value
  });
  form.reset();
  bootstrap.Modal.getInstance(document.getElementById("addPlanModal")).hide();
  await renderPlans();
  // Notify subscription page to update
  window.localStorage.setItem("plans_updated", Date.now());
};

// Edit Plan
editPlanForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const planId = form.planId.value;
  await updateDoc(doc(db, "plans", planId), {
    name: form.name.value,
    price: Number(form.price.value),
    description: form.description.value,
    features: form.features.value
  });
  bootstrap.Modal.getInstance(document.getElementById("editPlanModal")).hide();
  await renderPlans();
  // Notify subscription page to update
  window.localStorage.setItem("plans_updated", Date.now());
};

// Listen for CRUD changes from other tabs/windows
window.addEventListener("storage", (e) => {
  if (e.key === "plans_updated") {
    renderPlans();
  }
});

// Initial render
renderPlans();