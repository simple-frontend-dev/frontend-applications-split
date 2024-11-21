const html = String.raw;

export class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html`
      <style>
        div {
          text-align: center;
          padding: 2rem;
          font-size: 2rem;
          background-color: crimson;
        }
      </style>
      <div>Shared local package banner</div>
    `;
  }
}
