// Simple UI helpers: dialog management, validation, toast messages
const UI = (() => {
  // show toast
  function toast(msg, timeout=2200){
    const t = document.createElement('div'); t.className='toast fade-enter-active'; t.textContent=msg; document.body.appendChild(t);
    setTimeout(()=>{t.style.opacity='0'; setTimeout(()=>t.remove(),400)}, timeout);
  }

  // open dialog by id
  function openDialog(id){
    const d = document.getElementById(id); if(!d) return; if(typeof d.showModal==='function'){d.showModal();}
    else { d.setAttribute('open',''); d.style.display='block'; }
  }
  function closeDialog(id){
    const d = document.getElementById(id); if(!d) return; if(typeof d.close==='function'){d.close();} else { d.removeAttribute('open'); d.style.display='none'; }
  }

  // basic form validation for demo (returns boolean)
  function validateForm(form){
    // HTML5 validity first
    if(!form.reportValidity) return true;
    if(!form.checkValidity()){
      form.reportValidity();
      return false;
    }
    return true;
  }

  // confirmation
  function confirmAction(message){
    return window.confirm(message);
  }

  // wire up buttons with data-open attr
  function bind(){
    document.addEventListener('click', e=>{
      const t = e.target.closest('[data-open]'); if(t){ openDialog(t.dataset.open); }
      const c = e.target.closest('[data-close]'); if(c){ closeDialog(c.dataset.close); }
    });

    // intercept forms with data-validate
    document.addEventListener('submit', e=>{
      const form = e.target;
      if(form.matches('[data-validate]')){
        e.preventDefault();
        if(!validateForm(form)) return;
        // simulate success: close dialog if any and show toast
        const dlg = form.closest('dialog'); if(dlg) dlg.close();
        toast('Saved successfully');
      }
    });
  }

  return {bind,openDialog,closeDialog,toast,validateForm,confirmAction};
})();

// auto-bind on DOMContentLoaded
document.addEventListener('DOMContentLoaded', ()=>{ UI.bind(); });
// ============================
// Student Dialog Functionality
// ============================

const addStudentBtn = document.getElementById("addStudentBtn");
const studentDialog = document.getElementById("studentDialog");
const addStudentForm = document.getElementById("addStudentForm");

// Open the dialog when Add button is clicked
if (addStudentBtn && studentDialog) {
  addStudentBtn.addEventListener("click", () => {
    studentDialog.showModal();
  });
}

// Handle dialog form submission
if (addStudentForm) {
  addStudentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const course = document.getElementById("studentCourse").value;
    const gpa = document.getElementById("studentGPA").value;

    // Basic form validation
    if (!name || !email || !course || !gpa) {
      alert("⚠️ Please fill out all required fields correctly!");
      return;
    }

    // Create a new student card dynamically
    const studentGrid = document.querySelector(".student-grid");
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.innerHTML = `
      <img src="https://randomuser.me/api/portraits/lego/${Math.floor(
        Math.random() * 9
      )}.jpg" alt="${name}">
      <h3>${name}</h3>
      <p>Course: ${course}</p>
      <p>Email: ${email}</p>
      <p>GPA: ${gpa}</p>
      <a href="#" class="view-btn">View Profile</a>
    `;

    studentGrid.appendChild(card);

    // Close the dialog and reset the form
    studentDialog.close();
    addStudentForm.reset();

    // Success alert
    alert(`✅ ${name} has been added successfully!`);
  });
}

// Close dialog when user clicks Cancel
const cancelBtn = document.querySelector(".cancel-btn");
if (cancelBtn && studentDialog) {
  cancelBtn.addEventListener("click", () => {
    studentDialog.close();
  });
}
async function loadStudents() {
  const res = await fetch("http://localhost:5000/students");
  const data = await res.json();

  const container = document.querySelector(".student-grid");
  container.innerHTML = "";

  data.forEach(student => {
    container.innerHTML += `
      <div class="student-card">
        <h3>${student.name}</h3>
        <p>Course: ${student.course}</p>
        <p>Email: ${student.email}</p>
        <p>GPA: ${student.gpa}</p>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadStudents);
// Example: Fetch all students
fetch("http://localhost:5000/api/students")
  .then(response => response.json())
  .then(data => {
    console.log("Students:", data);
    // You can also dynamically update HTML here with the data
  })
  .catch(err => console.error("Error fetching students:", err));


  // Fetch and display students
async function loadStudents() {
  try {
    const res = await fetch("http://localhost:5000/students");
    const data = await res.json();

    console.log("Fetched students:", data);
    
    // Example: render in HTML
    const tableBody = document.querySelector("#studentTableBody");
    tableBody.innerHTML = data.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.course}</td>
      </tr>
    `).join("");
  } catch (err) {
    console.error("Error loading students:", err);
  }
}

loadStudents();


document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#studentsTable tbody");

  fetch("http://localhost:5000/students") // 👈 your backend URL
    .then(response => response.json())
    .then(data => {
      data.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.course}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => console.error("❌ Error fetching students:", err));
});