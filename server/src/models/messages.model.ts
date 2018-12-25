import { inject, injectable } from 'inversify';
import { Mongo } from './mongo';
import { Collection } from 'mongodb';

@injectable()
export class MessagesModel {
    private collection: Collection;

    constructor(@inject('Mongo') private mongoDb: Mongo) {}

    public async getAll(from: string, to: string): Promise<any> {
        this.collection = this.mongoDb.getCollection('messages');

        return this.collection
            .find(
                { $or: [{ from, to }, { from: to, to: from }] },
                { sort: { timestamp: 1 } }
            )
            .toArray();
    }

    public async addMessage(msg: any): Promise<any> {
        this.collection = this.mongoDb.getCollection('messages');

        msg.timestamp = Date.now();
        return this.collection.insertOne(msg);
    }
}
