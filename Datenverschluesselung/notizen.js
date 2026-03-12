let cryptoKey;

async function getKey(password) {

const enc = new TextEncoder();

const keyMaterial = await crypto.subtle.importKey(
"raw",
enc.encode(password),
{ name: "PBKDF2" },
false,
["deriveKey"]
);

return crypto.subtle.deriveKey(
{
name: "PBKDF2",
salt: enc.encode("salt"),
iterations: 100000,
hash: "SHA-256"
},
keyMaterial,
{ name: "AES-GCM", length: 256 },
false,
["encrypt","decrypt"]
);

}

async function unlockNotes(){

const password = document.getElementById("password").value;

cryptoKey = await getKey(password);

document.getElementById("notesArea").style.display = "block";

loadNotes();

}

async function saveNotes(){

const text = document.getElementById("notes").value;

const iv = crypto.getRandomValues(new Uint8Array(12));

const encrypted = await crypto.subtle.encrypt(
{ name:"AES-GCM", iv: iv },
cryptoKey,
new TextEncoder().encode(text)
);

const data = {

iv: Array.from(iv),

content: btoa(String.fromCharCode(...new Uint8Array(encrypted)))

};

localStorage.setItem("secureNotes", JSON.stringify(data));

document.getElementById("status").textContent="Notizen verschlüsselt gespeichert.";

}

async function loadNotes(){

const stored = localStorage.getItem("secureNotes");

if(!stored) return;

try{

const data = JSON.parse(stored);

const iv = new Uint8Array(data.iv);

const encryptedBytes = Uint8Array.from(atob(data.content), c => c.charCodeAt(0));

const decrypted = await crypto.subtle.decrypt(
{ name:"AES-GCM", iv: iv },
cryptoKey,
encryptedBytes
);

const text = new TextDecoder().decode(decrypted);

document.getElementById("notes").value = text;

}
catch{

document.getElementById("status").textContent="❌ Falsches Passwort";

}

}