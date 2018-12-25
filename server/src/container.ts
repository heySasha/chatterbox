import { Container } from 'inversify';
import { Mongo } from './models/mongo';
import { UsersModel } from './models/users.model';
import { Server } from './server';
import { App } from './app';
import { Router } from './router';
import { MessagesModel } from './models/messages.model';
import { Passport } from './passport';
import { WebSocket } from './webSocket';
import { BotBuilder, Bots } from './bots';
import { UsersController } from './controlers/users.controller';
import { MessagesController } from './controlers/messages.controller';

export const container = new Container();

container.bind<Server>('Server').to(Server).inSingletonScope();
container.bind<App>('App').to(App).inSingletonScope();
container.bind<Router>('Router').to(Router).inSingletonScope();
container.bind<Passport>('Passport').to(Passport).inSingletonScope();
container.bind<WebSocket>('Socket').to(WebSocket).inSingletonScope();

container.bind<Mongo>('Mongo').to(Mongo).inSingletonScope();
container.bind<UsersModel>('UsersModel').to(UsersModel).inSingletonScope();
container.bind<MessagesModel>('MessagesModel').to(MessagesModel).inSingletonScope();

container.bind<UsersController>('UsersController').to(UsersController).inSingletonScope();
container.bind<MessagesController>('MessagesController').to(MessagesController).inSingletonScope();

container.bind<BotBuilder>('BotBuilder').to(BotBuilder).inSingletonScope();
container.bind<Bots>('Bots').to(Bots).inSingletonScope();
