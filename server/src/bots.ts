import socketIo from 'socket.io-client';
import { inject, injectable } from 'inversify';
import { UsersModel } from './models/users.model';

@injectable()
export class BotBuilder {
    constructor(@inject('UsersModel') private users: UsersModel) {}

    public async build(name: string, email: string): Promise<SocketIOClient.Socket> {
        const bot = await this.users.createBot({ name, email, password: 'None' });

        return socketIo.connect(
            'http://localhost:3000',
            { query: bot }
        );
    }
}

@injectable()
export class Bots {
    constructor(
        @inject('BotBuilder') private botBuilder: BotBuilder,
        @inject('UsersModel') private users: UsersModel
    ) {}

    public async start() {
        const ignoreBot = await this.botBuilder.build('Ignore Bot', 'ignore@ignore');
        ignoreBot.on('message', () => {});

        const echoBot = await this.botBuilder.build('Echo Bot', 'echo@echo');
        echoBot.on('message', (msg: Message) => {
            echoBot.emit('message', {
                from: msg.to,
                to: msg.from,
                content: msg.content
            });
        });

        const reverseBot = await this.botBuilder.build(
            'Reverse Bot',
            'reverse@reverse'
        );
        reverseBot.on('message', (msg: Message) => {
            setTimeout(() => {
                echoBot.emit('message', {
                    from: msg.to,
                    to: msg.from,
                    content: msg.content
                        .split('')
                        .reverse()
                        .join('')
                });
            }, 3000);
        });

        const spamBot = await this.botBuilder.build('Spam Bot', 'spam@spam');
        spamBot.on('message', () => {});

        // const emails = await this.users.getEmails();
        //
        // (async function interval() {
        //     const random = getRandomizator(10000, 120000);
        //
        //     while (true) {
        //         await new Promise((res) => {
        //             setTimeout(() => {
        //                 emails.forEach((email: string) => {
        //                     spamBot.emit('message', {from: 'spam@spam', to: email, content: 'Hi!'});
        //                 });
        //                 res();
        //             }, random())
        //         });
        //     }
        // })();
    }
}

export interface Message {
    from: string;
    to: string;
    content: string;
}

function getRandomizator(a: number, b: number) {
    return () => Math.random() * (b - a) + a;
}
