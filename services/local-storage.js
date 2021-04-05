const CHAVE_CATEGORIAS = 'categorias';

export default class LocalStorage {
    static adicionarCategorias(categorias) {
        localStorage.removeItem(CHAVE_CATEGORIAS);
        localStorage.setItem(CHAVE_CATEGORIAS, categorias);
    }

    static categorias() {
        return localStorage.getItem(CHAVE_CATEGORIAS).split(',');
    }

    static possuiCategorias() {
        return localStorage.getItem(CHAVE_CATEGORIAS);
    }
}
