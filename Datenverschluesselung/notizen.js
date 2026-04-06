// =========================
// VERSCHLÜSSELUNG
// =========================
function encrypt(text, password) {
  let result = "";
  let shift = password.length;

  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) + shift);
  }

  return result;
}

function decrypt(text, password) {
  let result = "";
  let shift = password.length;

  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) - shift);
  }

  return result;
}

// =========================
// NOTIZ SPEICHERN
// =========================
function saveNote() {
  let text = document.getElementById("noteInput").value;
  let password = document.getElementById("password").value;

  if (!text || !password) {
    alert("Bitte alles eingeben!");
    return;
  }

  let encrypted = encrypt(text, password);

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.push(encrypted);
  localStorage.setItem("notes", JSON.stringify(notes));

  alert("Gespeichert!");
  document.getElementById("noteInput").value = "";
}

// =========================
// NOTIZEN ANZEIGEN
// =========================
function showNotes() {
  let password = document.getElementById("password").value;
  let container = document.getElementById("notesContainer");

  container.innerHTML = "";

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  notes.forEach(n => {
    let div = document.createElement("div");
    div.textContent = decrypt(n, password);
    container.appendChild(div);
  });
}

// =========================
// ALLE LÖSCHEN
// =========================
function deleteNotes() {
  localStorage.removeItem("notes");
  document.getElementById("notesContainer").innerHTML = "";
  alert("Alles gelöscht!");
}
