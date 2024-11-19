import "./style.css";
import { Header } from "@common/header";

customElements.define("website-header", Header);

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <website-header></website-header>
  <main>
    <h1>Blog</h1>
  </main>
`;
