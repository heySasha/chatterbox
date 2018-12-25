import express from 'express';
import { inject, injectable } from 'inversify';
import jwt from 'express-jwt';
import { UsersController } from './controlers/users.controller';
import { MessagesController } from './controlers/messages.controller';

const auth = jwt({
    secret: process.env.SECRET_KEY || 'MY_SECRET',
    userProperty: 'user'
});

@injectable()
export class Router {
    private readonly router: express.Router;

    constructor(
        @inject('UsersController') private usersController: UsersController,
        @inject('MessagesController') private messagesController: MessagesController
    ) {
        this.router = express.Router();
    }

    public get(): express.Router {
        this.router.get('/users', auth, this.usersController.getAll);
        this.router.post('/register', this.usersController.register);
        this.router.post('/login', this.usersController.login);

        this.router.get('/messages/:id', auth, this.messagesController.getMessagesByUserId);

        return this.router;
    }
}
