import { inject, injectable } from 'inversify';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Router } from './router';
import { Passport } from './passport';

@injectable()
export class App {
    private app: Express;

    constructor(
        @inject('Passport') private passport: Passport,
        @inject('Router') private router: Router
    ) {}

    public start(): void {
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(this.passport.get().initialize());

        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).send('Hi!');
        });

        this.app.use('/api', this.router.get());
    }

    public getApp(): Express {
        return this.app;
    }
}
