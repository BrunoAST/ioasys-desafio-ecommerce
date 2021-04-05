export class Carrinho {
    constructor(cliente, novoCliente) {
        this.cliente = cliente;
        this.novoCliente = novoCliente;
        this.data = new Date();
        this.produtos = [];
        this.valorTotal = 0;
        this.cupom = null;
    }

    adicionarProduto(produto, quantidade, precoUnitario) {
        this.produtos.push({ produto, quantidade, preco: precoUnitario });
        this.calcularValorTotal();
    }

    adicionarProdutos(lista) {
        this.produtos.push(...lista);
        this.calcularValorTotal();
    }

    calcularValorTotal() {
        this.valorTotal = this.produtos
            .reduce((acc, current) => acc += (current.preco * current.quantidade), 0);
    }

    adicionarCupom(codigo) {
        this.cupom = Number(codigo.replace(/\D/g, ''));
    }

    get totalDeItens() {
        const dados = this.produtos
            .reduce((acc, current) => acc + current.quantidade, 0);

        return dados;
    }

    get listaDeProdutos() {
        return this.produtos;
    }

    // calcular valor final (desconto para novos clientes OU cupom)
    fecharCompra() {
        // 20% de desconto para novos clientes
        if (this.novoCliente) {
            return this.valorTotal - (this.valorTotal * .2);
        }

        // desconto de XX% do cupom 
        if (this.cupom) {
            return this.valorTotal - (this.valorTotal * (this.cupom / 100));
        }

        // 5% de desconto para compras acima de 100 reais
        return this.valorTotal > 100 ?
            this.valorTotal - (this.valorTotal * .05) :
            this.valorTotal;
    }

    resumoDaCompra(metodoDePagamento, parcelas) {
        return `A compra será paga com o método de pagamento: ${metodoDePagamento}, dividido em ${parcelas} parcelas de R$${this.calcularValorParcelado(parcelas)}`;
    }

    calcularValorParcelado(parcelas) {
        return this.fecharCompra() / parcelas;
    }
}
