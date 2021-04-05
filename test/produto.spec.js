const { Carrinho } = require('../models/carrinho.js');
const faker = require('faker');

let produtos = [];
let carrinho = new Carrinho();

beforeEach(() => {
    produtos = [];
    Array.from({ length: 10 }).forEach(() => {
        produtos.push({
            produto: faker.vehicle.vehicle(),
            quantidade: 1,
            precoUnitario: faker.random.float({ min: 10000, max: 200000 })
        });
    });

    carrinho = new Carrinho('Amanda', true);
});

describe('Produto', () => {
    it('Deverá adicionar um único produto', () => {
        const carrinho = new Carrinho('Amanda', true);
        carrinho.adicionarProduto('Bicicleta', 1, 1500);
        expect(carrinho.produtos).toHaveLength(1);
    });

    it('Deverá inserir vários produtos', () => {
        carrinho.adicionarProdutos(produtos);
        expect(carrinho.produtos).toHaveLength(produtos.length);
    });

    it('Deverá calcular o valor total dos produtos adicionados', () => {
        carrinho.adicionarProduto('Fusca', 5000, 3);
        carrinho.calcularValorTotal();
        expect(carrinho.valorTotal).toBe(15000);
    });

    it('Deverá adicionar um cupom e acessar o valor dele', () => {
        carrinho.adicionarCupom('mega50');
        expect(typeof carrinho.cupom).toBe('number');
        expect(carrinho.cupom).toBe(50);
    });

    it('Deverá a quantidade total de itens', () => {
        carrinho.adicionarProdutos(produtos);
        expect(carrinho.totalDeItens).toBe(10);
    });

    it('Deverá retornar todos os produtos inseridos', () => {
        carrinho.adicionarProdutos(produtos);
        expect(carrinho.listaDeProdutos).toEqual(produtos);
    });

    it('Deverá calcular o valor da compra quando cliente novo - Aplicar 20% de desconto', () => {
        carrinho.adicionarProduto('Bicicleta', 1, 1500);
        expect(carrinho.fecharCompra()).toBe(1200);
    });

    it('Deverá calcular o valor da compra quando houver um cupom aplicado', () => {
        const carrinho = new Carrinho('Amanda', false);

        carrinho.adicionarProduto('Bicicleta', 1, 1500);
        carrinho.adicionarCupom('relampago50');
        expect(carrinho.fecharCompra()).toBe(750);
    });

    it('Deverá calcular o valor da compra com valores acima de 100 reais - Aplicar 5% de desconto', () => {
        const carrinho = new Carrinho('Amanda', false);

        carrinho.adicionarProduto('Bicicleta', 1, 1500);
        expect(carrinho.fecharCompra()).toBe(1425);
    });

    it('Deverá calcular o valor parcelado em 10 vezes da compra', () => {
        carrinho.adicionarProduto('Bicicleta', 1, 1500);
        expect(carrinho.calcularValorParcelado(10)).toBe(120);
    });

    it('Deverá retornar a mensagem da forma de pagamento selecionada e o valor das parcelas', () => {
        carrinho.adicionarProduto('Bicicleta', 1, 1500);
        const metodoDePagamento = 'Cartão de débito';
        const numeroDeParcelas = 5;
        const valorDoParcelamento = carrinho.calcularValorParcelado(numeroDeParcelas);

        expect(carrinho.resumoDaCompra(metodoDePagamento, numeroDeParcelas))
            .toBe(`A compra será paga com o método de pagamento: ${metodoDePagamento}, dividido em ${numeroDeParcelas} parcelas de R$${valorDoParcelamento}`);
    });
});