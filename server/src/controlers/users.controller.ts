import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { UsersModel } from '../models/users.model';
import { Passport } from '../passport';

@injectable()
export class UsersController {
    constructor(
        @inject('UsersModel') private users: UsersModel,
        @inject('Passport') private passport: Passport
    ) {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.users.getAll(req.user.email);
            res.send(users);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            await this.users.create(req.body);
            res.send({ data: 'Success!' });
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        const passport = this.passport.get();

        passport.authenticate('local', async (err, user, info) => {
            if (err) {
                res.status(404).json(err);
                return;
            }

            const token = await this.users.generateJwt(user);

            if (user) {
                res.status(200);
                res.json({
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    token
                });
            } else {
                res.status(401).json(info);
            }
        })(req, res);
    }
}
