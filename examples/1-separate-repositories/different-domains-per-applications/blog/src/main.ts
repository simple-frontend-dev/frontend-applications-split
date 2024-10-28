import "./style.css";

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <main>
    <h1>Blog</h1>
  </main>
`;
