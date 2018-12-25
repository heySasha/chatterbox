import { inject, injectable } from 'inversify';
import { Collection } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Mongo } from './mongo';

@injectable()
export class UsersModel {
    private collection: Collection;

    constructor(@inject('Mongo') private mongoDb: Mongo) {}

    public async getAll(email: string): Promise<any> {
        this.collection = this.mongoDb.getCollection('users');

        return this.collection
            .find(
                { email: { $ne: email } },
                { projection: { name: 1, email: 1, status: 1 } }
            )
            .toArray();
    }

    public async getEmails(): Promise<any> {
        this.collection = this.mongoDb.getCollection('users');

        return (await this.collection.find({}).toArray()).reduce(
            (emails: string[], user: any) => [...emails, user.email],
            []
        );
    }

    public async getByEmail(email: string): Promise<any> {
        this.collection = this.mongoDb.getCollection('users');

        return this.collection.findOne({ email });
    }

    public async create(user: any): Promise<any> {
        this.collection = this.mongoDb.getCollection('users');

        return this.collection.insertOne({
            name: user.name,
            email: user.email,
            password: bcrypt.hashSync(user.password, 10)
        });
    }

    public async addSocketId(socketId: string, email: string) {
        this.collection = this.mongoDb.getCollection('users');

        return this.collection.updateOne(
            { email },
            { $set: { socketId, status: 'online' } }
        );
    }

    public async removeSocketId(email: string) {
        this.collection = this.mongoDb.getCollection('users');

        return this.collection.updateOne(
            { email },
            { $set: { status: 'offline' }, $unset: { socketId: '' } }
        );
    }

    public async getSockedIdByEmail(email: string): Promise<string> {
        this.collection = this.mongoDb.getCollection('users');

        const user = await this.collection.findOne(
            { email, socketId: { $exists: true } },
            { projection: { socketId: 1 } }
        );

        if (user) {
            return user.socketId;
        }

        return null;
    }

    public async createBot(
        bot: any
    ): Promise<{ email: string; token: string }> {
        this.collection = this.mongoDb.getCollection('users');

        const doc = await this.collection.findOne(
            { email: bot.email },
            { projection: { email: 1, name: 1 } }
        );

        if (doc) {
            const token = await this.generateJwt(doc);

            return {
                email: doc.email,
                token
            };
        }

        const token = await this.generateJwt(bot);

        await this.collection.insertOne({
            name: bot.name,
            email: bot.email,
            password: bcrypt.hashSync(bot.password, 10),
            token
        });

        return {
            token,
            email: bot.email
        };
    }

    public async generateJwt(user: any): Promise<string> {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                name: user.name,
                exp: expiry.getTime() / 1000
            },
            process.env.SECRET_KEY || 'MY_SECRET'
        );

        this.collection = this.mongoDb.getCollection('users');
        await this.collection.updateOne({ _id: user._id }, { $set: { token } });

        return token;
    }
}
