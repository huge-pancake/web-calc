const FatButtonStyle = `
:host {
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 4px;
  width: calc(25% - 8px);
  height: 48px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 0;
  border-radius: 24px;
  outline: 0;
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;

  color: rgb(208, 188, 255);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.1px;
}
:host([dense]) {
  height: 30px;
}
:host([text]) {
  background-color: transparent;
}
:host([primary]) {
  color: rgb(56, 30, 114);
  background-color: rgb(208, 188, 255);
}
:host([secondary]) {
  color: rgb(232, 222, 248);
  background-color: rgb(74, 68, 88);
}
#state-layer {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
}
:host(:hover) #state-layer {
  opacity: 0.08;
}
:host(:focus-visible) #state-layer {
  opacity: 0.12;
}
:host(::before) #state-layer {
  opacity: 0.16;
}
`;

export default class FatButton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open', delegatesFocus: false });
  }
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }
  disconnectedCallback() {
    this.removeEventListeners();
  }
  render() {
    this.shadowRoot.innerHTML = this.html;
    this.tabIndex = this.tabIndex ? 0 : -1;
    this.setAttribute('rule', 'button');
  }
  addEventListeners() {
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('keyup', this.handleKeyUp);
  }
  removeEventListeners() {
    this.removeEventListener('keydown', this.handleKeyDown);
    this.removeEventListener('keyup', this.handleKeyUp);
  }
  handleKeyDown = (e) => {
    this.keyboardState = false;
    if (e.key === 'Enter') {
      this.click();
    }
  };
  handleKeyUp = (e) => {
    this.keyboardState = true;
    if (e.key === ' ') {
      this.click();
    }
  };
  keyboardState = true;
  static get is() {
    return 'fat-button';
  }
  get html() {
    return `
      <style>${FatButtonStyle}</style>
      <span id="state-layer"></span>
      <slot></slot>
    `;
  }
}

if (!customElements.get(FatButton.is)) {
  customElements.define(FatButton.is, FatButton);
}
