async function login() {
  const host = document.getElementById("host").value;
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.innerText = "Connecting...";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host, user, password }),
    });

    const data = await res.json();

    if (data.success) {
      msg.innerText = "Login successful!";
      setTimeout(() => {
        location.href = "/dashboard.html";
      }, 1000);
    } else {
      msg.innerText = " error: " + data.message;
    }
  } catch (err) {
    msg.innerText = "error: " + err.message;
  }
}

document.getElementById("loginBtn").addEventListener("click", login);
