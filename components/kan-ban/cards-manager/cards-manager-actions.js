import {CardsManager} from "./cards-manager.js";

export class CardsManagerActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async register(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const card = await crs.process.getValue(step.args.card, context, process, item);
        await crs.cardsManager.register(name, card);
    }

    static async unregister(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        await crs.cardsManager.unregister(name);
    }

    static async create(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const data = await crs.process.getValue(step.args.data, context, process, item);
        await crs.cardsManager.create(name, data);
    }
}

crs.cardsManager = new CardsManager();
crs.intent.cards_manager = CardsManagerActions;