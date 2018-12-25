import { inject, injectable } from 'inversify';
import * as http from 'http';
import { App } from './app';

const PORT = process.env.PORT || 3000;

@injectable()
export class Server {
    private server: http.Server;

    constructor(@inject('App') private app: App) {}

    public get(): http.Server {
        this.app.start();
        this.server = http.createServer(this.app.getApp());

        return this.server;
    }

    public async start(): Promise<void> {
        this.server.listen(PORT, () => {
            console.info(`Server started on port: ${PORT}`);
        });
    }
}
