const templateButton = document.createElement('template');
templateButton.innerHTML = `
    <style>
        .botao {
            width: 100%;
            height: 2.5rem;
            background-color: var(--primaria);
            color: var(--texto-contraste);
            border-radius: .9rem;
            outline: none;
            border: none;
            cursor: pointer;
            box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.1);
            transition: 200ms ease;
        }

        .botao:hover {
            box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.01);
            background-color: var(--secundaria);
        }
    </style>

    <button type="button" class="botao"></button>
`;

import ComponentBuilder from '../../services/component-builder.js';

class AppBotao extends ComponentBuilder {
    constructor() {
        super(templateButton);
    }

    connectedCallback() {
        this._definirTitulo();
    }

    disconnectedCallback() {}

    _definirTitulo() {
        this.shadowRoot.querySelector('button')
            .innerText = this.getAttribute('titulo');
    }
}

window.customElements.define('app-botao', AppBotao);
