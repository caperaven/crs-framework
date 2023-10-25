/**
 * @class CardsManager - this class is used to register templates for cards and help inflate them.
 */
export class CardsManager {
    #cards = {};

    get cards() {
        return this.#cards;
    }

    async register(name, template, inflationFn) {
        this.#cards[name] = { template, inflationFn };
    }

    async unregister(name) {
        delete this.#cards[name];
    }

    async get(name) {
        return this.#cards[name];
    }
}