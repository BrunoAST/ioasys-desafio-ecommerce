import { Carrinho } from './models/carrinho.js';

const meuCarrinho = new Carrinho('Padaria do Reinaldo', false);

meuCarrinho.adicionarProduto({}, 1, 10)

// adicionar uma lista 
const meusItens = [
    {
        quantidade: 1,
        preco: 10000,
        produto: 'Celtinha'
    },
    {
        quantidade: 1,
        preco: 150000,
        produto: 'Mercedes classe C'
    }
]

meuCarrinho.adicionarProdutos(meusItens);

// meuCarrinho.adicionarCupom('camp50');

console.log(meuCarrinho.fecharCompra());

console.log(meuCarrinho.resumoDaCompra('Cartão de Crédito', 3));
