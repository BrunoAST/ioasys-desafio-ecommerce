const templateListaDestaque = document.createElement('template');
templateListaDestaque.innerHTML = `
    <style>
        .container {
            display: grid;
            gap: 3.5rem;
            grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
        }

        h3 {
            margin-bottom: 0;
        }

        .img-produto {
            width: 10rem;
            height: 12rem;
            align-self: center;
        }

        .titulo, .descricao, .preco {
            font-size: .85rem;
        }

        .titulo {
            text-align: center;
        }

        .descricao {
            font-weight: 300;
        }

        .preco {
            color: var(--primaria);
            font-weight: bold;
        }

        #botao {
            margin-top: 1rem;
        }

        .itens {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
    </style>

    <section id="produtos" class="container">
    </section>
`;

import { base, detalhesProdutoUrl } from '../../routes/router.js';
import ComponentBuilder from '../../services/component-builder.js';
import HttpBase from '../../services/http-base.js';

class AppListaprodutosDestaque extends ComponentBuilder {
    constructor() {
        super(templateListaDestaque);

        this._eventosReferencia = [];
    }

    connectedCallback() {
        this._getDestaques();
    }

    disconnectedCallback() {
        this._eventosReferencia.forEach(evento => evento.removeEventListener());

        this._eventosReferencia = [];
    }

    async _getDestaques() {
        let destaques = [];

        await HttpBase.getDestaques().then(res => destaques = res);

        this._exibirProdutosEmDestaque(destaques);
    }

    _exibirProdutosEmDestaque(produtos) {
        produtos.forEach(produto => {
            const sectionRef = this.shadowRoot.querySelector('#produtos');
            const container = document.createElement('div');
            const img = this._criarImagem(produto.image);
            const titulo = this._criarTitulo(produto.title);
            const descricao = this._criarDescricao(produto.description);
            const preco = this._criarPreco(produto.price);
            const botao = this._criarBotao(produto.id);

            container.classList.add('itens');

            container.appendChild(img);
            container.appendChild(titulo);
            container.appendChild(descricao);
            container.appendChild(preco);     
            container.appendChild(botao);
            sectionRef.appendChild(container);
        });
    }

    _criarImagem(url) {
        const img = document.createElement('img');
        img.classList.add('img-produto');
        img.src = url;
        img.alt = 'Imagem do produto';

        return img;
    }

    _criarTitulo(titulo) {
        const h3 = document.createElement('h3');
        h3.classList.add('titulo');
        h3.innerText = titulo;

        return h3;
    }

    _criarDescricao(descricao) {
        const p = document.createElement('p');
        p.classList.add('descricao');
        p.innerText = `${descricao.slice(0, 45)}...`;

        return p;
    }

    _criarPreco(preco) {
        const span = document.createElement('span');
        span.classList.add('preco');
        span.innerText = `R$ ${preco}`;

        return span;
    }

    _criarBotao(id) {
        const botao = document.createElement('app-botao') ;
        botao.setAttribute('titulo', 'Comprar');
        botao.setAttribute('data-id', id);

        const evento = botao.addEventListener('click', (event) => {
            window.location = `${base}/${detalhesProdutoUrl}?id=${id}`;
        });

        this._eventosReferencia.push(evento);

        return botao;
    }
}

window.customElements.define('app-lista-produtos-destaque', AppListaprodutosDestaque);
