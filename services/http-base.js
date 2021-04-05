export default class HttpBase {
    static async getCategorias() {
        return await fetch('https://fakestoreapi.com/products/categories')
            .then(res => res.json());
    }

    static async getDestaques() {
        return await fetch('https://fakestoreapi.com/products?limit=5')
            .then(res=>res.json());
    }
}
