import "./style.css";

try {
  import("web-vitals-reporter");
} catch (error) {
  console.error(error);
}

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <main>
    <h1>Blog</h1>
  </main>
`;

try {
  const { Banner } = await import("banner");
  document.body.prepend(
    Banner({ text: "Hello banner", backgroundColor: "darkorange" })
  );
} catch (error) {
  console.error(error);
}
