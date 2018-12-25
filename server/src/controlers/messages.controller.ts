import { inject, injectable } from 'inversify';
import { MessagesModel } from '../models/messages.model';
import { Request, Response } from 'express';

@injectable()
export class MessagesController {
    constructor(@inject('MessagesModel') private messages: MessagesModel) {
        this.getMessagesByUserId = this.getMessagesByUserId.bind(this);
    }

    public async getMessagesByUserId(req: Request, res: Response): Promise<void> {
        try {
            const messages = await this.messages.getAll(
                req.user.email,
                req.params.id
            );
            res.send(messages);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
}