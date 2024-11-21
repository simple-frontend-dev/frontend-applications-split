import "./style.css";

import("web-vitals-reporter").catch((error) => {
  console.error("Unable to load web-vitals-reporter module: ", error);
});

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <nav>
    <a href="/home">Home</a>
    <a href="/blog">Blog</a>
  </nav>
  <main>
    <h1>Homepage</h1>
  </main>
`;

try {
  const { Banner } = await import("banner");
  document.body.prepend(
    Banner({
      text: "Runtime shared banner module",
      backgroundColor: "crimson",
    })
  );
} catch (error) {
  console.error("Unable to load banner module: ", error);
}
