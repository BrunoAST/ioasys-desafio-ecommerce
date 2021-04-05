const templateBaner = document.createElement('template');
templateBaner.innerHTML = `
    <style>
        .banner {
            height: 10rem;
            width: 100%;
        }
    </style>

    <picture>
        <img class="banner" src="assets/baner.png" alt="Baner" />
    </picure>
`;

import ComponentBuilder from '../../services/component-builder.js';

class AppBaner extends ComponentBuilder {
    constructor() {
        super(templateBaner);
    }

    connectedCallback() {}

    disconnectedCallback() {}
}

window.customElements.define('app-baner', AppBaner);
