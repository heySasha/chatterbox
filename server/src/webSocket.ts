import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { Server } from './server';
import { Socket } from 'socket.io';
import { UsersModel } from './models/users.model';
import { MessagesModel } from './models/messages.model';
import { Bots } from './bots';

@injectable()
export class WebSocket {
    constructor(
        @inject('UsersModel') private users: UsersModel,
        @inject('MessagesModel') private messages: MessagesModel,
        @inject('Bots') private bots: Bots,
        @inject('Server') private server: Server
    ) {}

    public start(): void {
        const server = this.server.get();

        const io = require('socket.io')(server);

        io.use((socket: any, next: Function) => {
            if (socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(
                    socket.handshake.query.token,
                    process.env.SECRET_KEY || 'MY_SECRET',
                    (err: any, decoded: any) => {
                        if (err) {
                            return next(new Error('Authentication error'));
                        }

                        socket.decoded = decoded;
                        next();
                    }
                );
            } else {
                next(new Error('Authentication error'));
            }
        });

        this.bots.start();

        io.on('connection', async (socket: Socket) => {
            socket.broadcast.emit('user-event', true);
            this.users.addSocketId(socket.id, socket.request._query.email);

            socket.on('message', async msg => {
                this.messages.addMessage(msg);
                const socketId = await this.users.getSockedIdByEmail(msg.to);

                if (socketId) {
                    socket.to(socketId).emit('message', msg);
                }
            });

            socket.on('type', async msg => {
                const socketId = await this.users.getSockedIdByEmail(msg.email);

                if (socketId) {
                    socket
                        .to(socketId)
                        .emit('type', { email: socket.request._query.email });
                }
            });

            socket.on('disconnect', () => {
                this.users.removeSocketId(socket.request._query.email);

                socket.broadcast.emit('user-event', true);
            });
        });
    }
}
