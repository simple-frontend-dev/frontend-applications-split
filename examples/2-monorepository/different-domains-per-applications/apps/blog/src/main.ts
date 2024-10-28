import "./style.css";
import "header";

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <website-header></website-header>
  <main>
    <h1>Blog</h1>
  </main>
`;
