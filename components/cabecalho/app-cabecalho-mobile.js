const templateMobile = document.createElement('template');
templateMobile.innerHTML = `
    <style>
        .sidenav-container {
            background-color: var(--texto-contraste);
            height: 100%;
            width: 250px;
            position: absolute;
            box-shadow: 14px 0px 17px 0px rgba(0,0,0,0.4);
            animation: slideIn 200ms ease;
        }

        @keyframes slideIn {
            0% {
                transform: translateX(-200px);
            }

            100% {
                transform: translateX(0);
            }
        }

        li {
            list-style: none;
            margin: 1rem 0;
        }

        .links {
            height: 80vh;
            overflow-y: auto;
            text-transform: capitalize;
        }

        .acoes-links {
            margin: 1rem 0;
            transition: 200ms ease;
        }

        .acoes-links:hover {
            text-decoration: underline;
            color: var(--secundaria);
        }

        .botoes {
            position: absolute;
            display: flex;
            gap: 2rem;
            margin: 2rem;
        }

        @media(max-width: 599px) {
            .links {
                height: 70vh
            }
        }
    </style>

    <sidenav id="menu-lateral" class="sidenav-container">
        <ul id="categorias" class="links"></ul>

        <div class="botoes">
            <li>
                <a class="acoes-links">
                    <picture>
                        <img class="acoes__icones" src="assets/user-avatar-mobile.svg" alt="Usuário avatar" />
                    </picture>
                </a>
            </li>
            <hr />
            <li>
                <a class="acoes-links">
                    <picture>
                        <img class="acoes__icones" src="assets/cart-mobile.svg" alt="Carrinho de compras" />
                    </picture>
                </a>
            </li>
        <div>
    </sidenav>
`;

import LocalStorage from '../../services/local-storage.js';
import ComponentBuilder from '../../services/component-builder.js';

class AppCabecalhoMobile extends ComponentBuilder {
    constructor() {
        super(templateMobile);
    }

    connectedCallback() {
        this._exibirCategoriasDisponiveis();
    }

    disconnectedCallback() {
    }

    _exibirCategoriasDisponiveis() {
        const categorias = LocalStorage.categorias();

        categorias.forEach((categoria) => {
            const ulRef = this.shadowRoot.querySelector('#categorias');
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.classList.add('acoes-links');
            a.appendChild(document.createTextNode(categoria));

            li.appendChild(a);
            ulRef.appendChild(li);
        });
    }
}

window.customElements.define('app-cabecalho-mobile', AppCabecalhoMobile);