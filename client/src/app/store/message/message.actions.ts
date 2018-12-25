import { Action } from '@ngrx/store';
import { Message, User } from '../../types';

export enum MessageActionTypes {
    SendMessage = '[Message] Send Message',
    LoadMessageFromSocket = '[Message] Load Message From Socket',
    LoadMessages = '[Message] Load Messages',
    LoadMessagesSuccess = '[Message] Load Messages Success',
    LoadMessagesFail = '[Message] Load Messages Fail',
    SelectUser = '[User] Select User'
}

export class SendMessage implements Action {
    readonly type = MessageActionTypes.SendMessage;

    constructor(public payload: Message) {}
}

export class LoadMessageFromSocket implements Action {
    readonly type = MessageActionTypes.LoadMessageFromSocket;

    constructor(public payload: Message) {}
}

export class LoadMessages implements Action {
    readonly type = MessageActionTypes.LoadMessages;

    constructor(public payload: User) {
    }
}

export class LoadMessagesSuccess implements Action {
    readonly type = MessageActionTypes.LoadMessagesSuccess;

    constructor(public payload: Message[]) {}
}

export class LoadMessagesFail implements Action {
    readonly type = MessageActionTypes.LoadMessagesFail;

    constructor(public payload: string) {}
}

export class SelectUser implements Action {
    readonly type = MessageActionTypes.SelectUser;

    constructor(public payload: User) {}
}

export type MessageActions =
    | SendMessage
    | LoadMessageFromSocket
    | LoadMessages
    | LoadMessagesSuccess
    | LoadMessagesFail
    | SelectUser;
