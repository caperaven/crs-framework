export class CardsManager {
    #cards = {};

    async register(name, card) {
        this.#cards[name] = card;
    }

    async unregister(name) {
        delete this.#cards[name];
    }

    async create(name, data) {
        const template = this.#cards[name];
        const result = [];

        for (const record of data) {
            const card = await inflateCard(template, record);
            result.push(card);
        }

        return result;
    }
}

async function inflateCard(cardTemplate, record) {

}