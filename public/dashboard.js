document.getElementById("loadBtn").addEventListener("click", loadDatabases);
document.getElementById("addDbBtn").addEventListener("click", addDatabase);
document.getElementById("addUserBtn").addEventListener("click", addUser);
document.getElementById("createTableBtn").addEventListener("click", createTable);

async function loadDatabases() {
  const dbList = document.getElementById("dbList");
  const res = await fetch("/databases");
  const data = await res.json();
  if (res.ok) {
    dbList.innerHTML = "";
    data.forEach((db) => {
      const li = document.createElement("li");
      li.textContent = db.Database;
      dbList.appendChild(li);
    });
  } else {
    dbList.innerHTML = "Error: " + data.message;
  }
}

async function addDatabase() {
  const dbName = document.getElementById("newDbName").value;
  const msg = document.getElementById("dbMsg");
  const res = await fetch("/add-database", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dbName }),
  });
  const data = await res.json();
  msg.innerText = data.message;
}

async function addUser() {
  const username = document.getElementById("newUser").value;
  const password = document.getElementById("newUserPass").value;
  const msg = document.getElementById("userMsg");
  const res = await fetch("/add-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  msg.innerText = data.message;
}

async function createTable() {
  const dbName = document.getElementById("dbName").value;
  const tableName = document.getElementById("tableName").value;
  const columns = document.getElementById("columns").value;
  const msg = document.getElementById("tableMsg");

  const res = await fetch("/create-table", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dbName, tableName, columns }),
  });
  const data = await res.json();
  msg.innerText = data.message;
}

