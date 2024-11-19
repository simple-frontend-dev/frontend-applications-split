import "./style.css";

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
