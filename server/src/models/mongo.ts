import { injectable } from 'inversify';
import { Collection, Db, MongoClient } from 'mongodb';

@injectable()
export class Mongo {
    private db: Db;

    public async connect(): Promise<void> {
        try {
            const client = await MongoClient.connect(
                process.env.MONGODB_URI || 'mongodb://localhost:27017',
                { useNewUrlParser: true }
            );
            this.db = client.db('chatterbox');

            await this.createUsers();
            await this.createMessages();

            console.info('Connected to db!');
        } catch (error) {
            console.error(error);
        }
    }

    public async createUsers(): Promise<void> {
        const collection = await this.db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            bsonType: 'string',
                            description: 'Name must be a string and is required!'
                        },
                        email: {
                            bsonType: 'string',
                            description: 'Email must be a string and is required!'
                        },
                        password: {
                            bsonType: 'string',
                            description: 'Password must be a string of 6 symbols or higher and is required!'
                        },
                        status: {
                            bsonType: 'string',
                            description: 'Status must be a string!'
                        },
                        socketId: {
                            bsonType: 'string',
                            description: 'SocketId must be a string!'
                        }
                    }
                }
            }
        });

        await collection.createIndexes([
            {
                key: { name: 1 },
                unique: true
            },
            {
                key: { email: 1 },
                unique: true
            },
            {
                key: { socketId: 1 },
                unique: true
            }
        ]);
    }

    public async createMessages(): Promise<void> {
        const collection = await this.db.createCollection('messages', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['from', 'to', 'content'],
                    properties: {
                        from: {
                            bsonType: 'string',
                            description: 'From must be a string and is required!'
                        },
                        to: {
                            bsonType: 'string',
                            description: 'To must be a string and is required!'
                        },
                        content: {
                            bsonType: 'string',
                            description: 'Content must be a string and is required!'
                        }
                    }
                }
            }
        });

        await collection.createIndexes([
            {
                key: { from: 1 }
            },
            {
                key: { to: 1 }
            }
        ]);
    }

    public getCollection(name: string): Collection {
        return this.db.collection(name);
    }
}
