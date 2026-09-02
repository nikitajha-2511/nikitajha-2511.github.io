/* ==========================================================================
   GOOGLE KEEP NOTES - LIVE APP SCRIPT
   Author: Nikita Jha
   ========================================================================== */

const defaultNotes = [
  {
    id: 1,
    title: "Javascript",
    content: "topics remaining - DOM manipulation and event delegation",
    color: "#ffffff"
  },
  {
    id: 2,
    title: "React",
    content: "topics remaining - Project build & state management hooks",
    color: "#fff8e1"
  },
  {
    id: 3,
    title: "HTML",
    content: "topics remaining - forms, input validation & accessibility",
    color: "#e8f0fe"
  },
  {
    id: 4,
    title: "CSS",
    content: "topics remaining - CSS Grid & Responsive layouts",
    color: "#e6f4ea"
  }
];

let currentSelectedColor = "#ffffff";

// DOM Elements
const createForm = document.getElementById("createForm");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const colorDots = document.querySelectorAll(".color-dot");

// Initialize State from LocalStorage
function getStoredNotes() {
  const stored = localStorage.getItem("nikita_keep_notes");
  if (!stored) {
    localStorage.setItem("nikita_keep_notes", JSON.stringify(defaultNotes));
    return defaultNotes;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultNotes;
  }
}

function saveNotes(notes) {
  localStorage.setItem("nikita_keep_notes", JSON.stringify(notes));
}

let notes = getStoredNotes();

// Render Notes
function renderNotes() {
  notesGrid.innerHTML = "";

  if (notes.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.style.backgroundColor = note.color || "#ffffff";

    const titleEl = document.createElement("h3");
    titleEl.className = "note-card-title";
    titleEl.textContent = note.title || "Untitled";

    const contentEl = document.createElement("p");
    contentEl.className = "note-card-content";
    contentEl.textContent = note.content || "";

    const footerEl = document.createElement("div");
    footerEl.className = "note-card-footer";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete-note";
    deleteBtn.title = "Delete Note";
    deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    });

    footerEl.appendChild(deleteBtn);

    if (note.title) card.appendChild(titleEl);
    card.appendChild(contentEl);
    card.appendChild(footerEl);

    notesGrid.appendChild(card);
  });
}

// Add Note
function addNote(title, content, color) {
  if (!title.trim() && !content.trim()) return;

  const newNote = {
    id: Date.now(),
    title: title.trim(),
    content: content.trim(),
    color: color || "#ffffff"
  };

  notes.unshift(newNote);
  saveNotes(notes);
  renderNotes();

  // Reset inputs
  titleInput.value = "";
  contentInput.value = "";
  currentSelectedColor = "#ffffff";
  createForm.style.backgroundColor = "#ffffff";
  resetColorDots();
}

// Delete Note
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes(notes);
  renderNotes();
}

// Color picker handling
function resetColorDots() {
  colorDots.forEach(dot => dot.classList.remove("active"));
  const firstDot = document.querySelector('.color-dot[data-color="#ffffff"]');
  if (firstDot) firstDot.classList.add("active");
}

colorDots.forEach(dot => {
  dot.addEventListener("click", () => {
    colorDots.forEach(d => d.classList.remove("active"));
    dot.classList.add("active");
    currentSelectedColor = dot.getAttribute("data-color");
    createForm.style.backgroundColor = currentSelectedColor;
  });
});

// Expand create area on focus
contentInput.addEventListener("focus", () => {
  createForm.classList.add("expanded");
});

document.addEventListener("click", (e) => {
  if (!createForm.contains(e.target)) {
    // If empty, collapse
    if (!titleInput.value.trim() && !contentInput.value.trim()) {
      createForm.classList.remove("expanded");
      createForm.style.backgroundColor = "#ffffff";
    }
  }
});

// Form Submit
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNote(titleInput.value, contentInput.value, currentSelectedColor);
});

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderNotes();
});
