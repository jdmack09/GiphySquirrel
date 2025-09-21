const app = document.getElementById("app");
const links = document.querySelectorAll(".nav-link");
const API_KEY = "QAmudxZkNmufoXBfo5xHp3JLpQrBFt5Z"; 
const LIMIT = 18;

function renderHome() {
  app.innerHTML = `
    <section>
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search squirrel GIFs..." />
        <button id="searchBtn">Search</button>
      </div>
      <div class="results" id="results"></div>
    </section>
  `;

  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("searchInput");

  btn.addEventListener("click", searchGifs);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btn.classList.add("active");
      searchGifs();
      setTimeout(() => btn.classList.remove("active"), 150);
    }
  });
}

function renderAbout() {
  app.innerHTML = `
    <section class="section">
      <h2>About 🐿️</h2>
      <p><strong>Squirrel Giphy Finder</strong> is a playful web app that helps you discover GIFs in style.</p>
      <p>We bring the fun of the Giphy API into a cozy woodland-themed experience.</p>
    </section>
  `;
}

function renderDocs() {
  app.innerHTML = `
    <section class="section">
      <h2>Docs 📜</h2>
      <p><strong>Search:</strong> Enter a keyword (e.g. “squirrel”, “funny”, “cats”).</p>
      <p><strong>GIFs:</strong> Results are powered by the <a href="https://developers.giphy.com/" target="_blank">Giphy API</a>.</p>
      <p><strong>Navigation:</strong> This is a Single Page App (SPA) — use the nav menu without page reloads!</p>
    </section>
  `;
}

// Giphy Search
async function searchGifs() {
  const query = document.getElementById("searchInput").value.trim();
  const results = document.getElementById("results");
  const btn = document.getElementById("searchBtn");

  if (!query) {
    results.innerHTML = "<p>Please enter a search term 🐿️</p>";
    return;
  }

  results.innerHTML = "<p>Loading...</p>";
  btn?.classList.add("loading");

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${LIMIT}&rating=g`
    );
    const data = await response.json();

    if (data.data.length === 0) {
      results.innerHTML = "<p>No GIFs found 🥺</p>";
      return;
    }

    results.innerHTML = "";
    data.data.forEach((gif) => {
      const container = document.createElement("div");
      container.classList.add("gif-container");

      const link = document.createElement("a");
      link.href = gif.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = gif.images.fixed_height.url;
      img.alt = gif.title || query;

      link.appendChild(img);
      container.appendChild(link);

      const copyBtn = document.createElement("button");
      copyBtn.classList.add("copy-btn");
      copyBtn.textContent = "Copy Link";

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(gif.url);
          copyBtn.textContent = "Copied! ✅";
          setTimeout(() => (copyBtn.textContent = "Copy Link"), 2000);
        } catch {
          copyBtn.textContent = "Error ❌";
          setTimeout(() => (copyBtn.textContent = "Copy Link"), 2000);
        }
      });

      container.appendChild(copyBtn);
      results.appendChild(container);
    });
  } catch (error) {
    console.error("Error fetching from Giphy API:", error);
    results.innerHTML = "<p>Oops, something went wrong! 🐿️</p>";
  } finally {
    btn?.classList.remove("loading");
  }
}

// Router
function handleRoute() {
  const hash = window.location.hash || "#home";
  links.forEach(link => link.classList.remove("active"));
  document.querySelector(`a[href="${hash}"]`)?.classList.add("active");

  if (hash === "#home") renderHome();
  if (hash === "#about") renderAbout();
  if (hash === "#docs") renderDocs();
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);
