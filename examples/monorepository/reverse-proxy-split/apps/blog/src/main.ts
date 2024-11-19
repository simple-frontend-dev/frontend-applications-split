import "./style.css";
import { Header } from "@common/header";

customElements.define("website-header", Header);

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <website-header></website-header>
  <nav>
    <a href="/home">Home</a>
    <a href="/blog">Blog</a>
  </nav>
  <main>
    <h1>Blog</h1>
  </main>
`;
