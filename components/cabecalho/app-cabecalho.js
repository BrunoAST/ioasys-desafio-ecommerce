const template = document.createElement('template');
template.innerHTML = `
    <style>
        .cabecalho-container {
            max-height: 130px;
            background-color: var(--primaria);
            color: var(--texto-contraste);
            display: flex;
            gap: 1rem;
            align-items: center;
            padding: 1rem;
        }

        .logo {
            width: 5rem;
        }

        li {
            list-style: none;
        }

        a {
            cursor: pointer;
        }

        .acoes {
            font-size: .8rem;
            display: flex;
            justify-content: flex-end;
            padding: 0;
        }

        .acoes__itens {
            display: flex;
            gap: 1rem;
            align-items: center;
            max-width: 8.75rem;
            font-size: .687rem;
            cursor: pointer;
            transition: 200ms ease;
        }

        .acoes__icones {
            width: 2.65rem;
        }

        .pesquisa-links {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
        }

        .formulario-pesquisa {
            display: flex;
            flex-grow: 1;
            gap: 1rem;
            gap: .625rem;
        }

        .campo-pesquisa {
            outline: none;
            border: none;
            background-color: var(--texto-contraste);
            color: var(--texto-primario);
            height: 2rem;
            width: 100%;
            padding: .3rem 1.3rem;
            font-size: 1.5rem;
            font-weight: 100;
        }

        .btn-pesquisa, .btn-menu {
            outline: none;
            border: none;
            background-color: var(--texto-contraste);
            width: 3.5rem;
            height: 2.6rem;
            cursor: pointer;   
        }

        .btn-menu {
            display: none;
        }

        .links {
            display: flex;
            flex-wrap: wrap;  
            gap: 1rem;
            cursor: pointer;
            text-transform: capitalize;
            padding: 0;
            margin: 1rem 0 0 0;
        }

        .acoes-links {
            color: var(--texto-contraste);
            font-size: .875rem;
            transition: 200ms ease;
        }

        .acoes-links:hover, .acoes__itens:hover {
            text-decoration: underline;
            color: var(--secundaria);
        }

        .menu-lateral-invisivel {
            display: none;
        }

        @media(max-width: 959px) {
            .links, .acoes, .logo {
                display: none;
            }

            .btn-menu {
                display: block;
            }
        }

        @media(max-width: 599px) {
            .cabecalho-container {
                padding: .3rem;
            }

            .btn-pesquisa, .btn-menu {
                width: 4.5rem;
            }
        }
    </style>

    <header id="navegacao">
        <nav class="cabecalho-container">
            <a id="logo">
                <img class="logo" src="assets/logo.svg" alt="Logo" />
            </a>

            <div class="pesquisa-links">
                <form class="formulario-pesquisa">
                    <button
                        class="btn-menu"
                        type="button"
                        id="btn-exibir-menu-lateral"
                    >
                        <img src="assets/menu.png" alt="Botão para exibição do menu" />
                    </button>

                    <input
                        class="campo-pesquisa"
                        type="text"
                        id="campo-pesquisa"
                        placeholder="Encontre os produtos que você procura"
                    />

                    <button
                        class="btn-pesquisa"
                        type="submit"
                    >
                        <img src="assets/lupa.svg" alt="Botão de pesquisa" />
                    </button>
                </form>

                <ul id="categorias" class="links"></ul>
            </div>

            <ul class="acoes">
                <li>
                    <a class="acoes__itens">
                        <picture>
                            <img class="acoes__icones" src="assets/user-avatar.svg" alt="Usuário avatar" />
                        </picture>
                        <span class="acoes__texto">Entre ou cadastre-se</span>
                    </a>
                </li>
                <li>
                    <a class="acoes__itens">
                        <picture>
                            <img class="acoes__icones" src="assets/cart.svg" alt="Carrinho de compras" />
                        </picture>
                        <span class="acoes__texto">Carrinho de compras</span>
                    </a>
                </li>
            </ul>
        </nav>
    </header>
`;

import HttpBase from '../../services/http-base.js';
import LocalStorage from '../../services/local-storage.js';
import ComponentBuilder from '../../services/component-builder.js';
import { base, home, categoriaUrl } from '../../routes/router.js';

class AppCabecalho extends ComponentBuilder {
    constructor() {
        super(template);

        this._eventoReferencia = [];
    }

    connectedCallback() {
        this._atribuirLinkLogo();
        this._pesquisarCategorias();
        this._criarMenuPorEventoAlteracoesTamanhoJanela();
        this._exibirMenuLateralAoClicarBtn();
        window.dispatchEvent(new Event('resize'));
    }

    disconnectedCallback() {
        this._eventoReferencia.forEach(evento => evento.removeEventListener());
        this._eventoReferencia = [];
    }

    get _elementoMenuLateral() {
        return this.shadowRoot.querySelector('#menu-lateral');
    }

    async _pesquisarCategorias() {
        let categorias = [];

        if (LocalStorage.possuiCategorias()) {
            categorias = LocalStorage.categorias();
        } else {
            await HttpBase.getCategorias().then(res => categorias = res);
        }

        LocalStorage.adicionarCategorias(categorias);
        this._exibirCategoriasDisponiveis(categorias);
    }

    _exibirCategoriasDisponiveis(categorias) {
        categorias.forEach((categoria) => {
            const ulRef = this.shadowRoot.querySelector('#categorias');
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.classList.add('acoes-links');
            a.href = `${base}/${categoriaUrl}?cat=${categoria}`;
            a.appendChild(document.createTextNode(categoria));

            li.appendChild(a);
            ulRef.appendChild(li);
        });
    }

    _exibirMenuLateralAoClicarBtn() {
        const evento = this.shadowRoot
            .querySelector('#btn-exibir-menu-lateral')
            .addEventListener('click', () => {
                if (this._objetoManuLateral().jaPossuiMenuLateral) {
                    this._destruirMenuLateral();
                    return;
                }

                this._construirMenuLateral();
            });

        this._eventoReferencia.push(evento);
    }

    _criarMenuPorEventoAlteracoesTamanhoJanela() {
        const evento = window.addEventListener('resize', (event) => {
            const largura = event.target.innerWidth;

            if (largura > 959) {
                this._destruirMenuLateral();
                return;
            }

            this._construirMenuLateral();
        });

        this._eventoReferencia.push(evento);
    }

    _destruirMenuLateral() {
        if (this._objetoManuLateral().jaPossuiMenuLateral) {
            this._objetoManuLateral().raiz.removeChild(
                Array.from(this._objetoManuLateral().raiz.childNodes).find(el => el.nodeName.includes('APP-CABECALHO-MOBILE'))
            );
            return;
        }
    }

    _construirMenuLateral() {
        if (this._objetoManuLateral().jaPossuiMenuLateral) { return; }
        this._objetoManuLateral()
            .raiz.appendChild(this._objetoManuLateral().elemento);
    }

    _objetoManuLateral() {
        const elemento = document.createElement('app-cabecalho-mobile');
        const raiz = this.shadowRoot.querySelector('#navegacao');
        const jaPossuiMenuLateral = Array.from(raiz.childNodes).find(el => el.nodeName.includes('APP-CABECALHO-MOBILE'));

        return { elemento, raiz, jaPossuiMenuLateral };
    }

    _atribuirLinkLogo() {
        let a = this.shadowRoot.querySelector('#logo');
        a.href = `${base}/${home}`;
    }
}

window.customElements.define('app-cabecalho', AppCabecalho);
