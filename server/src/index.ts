import 'reflect-metadata';
import { container } from './container';
import { Server } from './server';
import { Mongo } from './models/mongo';
import { WebSocket } from './webSocket';

async function main() {
    const mongoDb: Mongo = container.get('Mongo');
    const socket: WebSocket = container.get('Socket');
    const server: Server = container.get('Server');

    await mongoDb.connect();
    await socket.start();
    await server.start();
}

main().then().catch();
