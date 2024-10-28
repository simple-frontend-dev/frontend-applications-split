import "./style.css";

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <main>
    <h1>Homepage</h1>
  </main>
`;
