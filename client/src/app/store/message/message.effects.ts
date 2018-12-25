import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as messageActions from './message.actions';

import { MessagesService } from '../../services/messages.service';
import { SocketService } from '../../services/socket.service';

@Injectable()
export class MessageEffects {
    constructor(
        private messagesService: MessagesService,
        private socketService: SocketService,
        private actions$: Actions
    ) {}

    @Effect()
    loadMessages$: Observable<Action> = this.actions$.pipe(
        ofType(messageActions.MessageActionTypes.LoadMessages),
        map((action: messageActions.LoadMessages) => action.payload),
        mergeMap(user =>
            this.messagesService.getMessages(user).pipe(
                map(messages => new messageActions.LoadMessagesSuccess(messages)),
                catchError(err => of(new messageActions.LoadMessagesFail(err)))
            )
        )
    );

    @Effect()
    loadMessage$: Observable<Action> = this.actions$.pipe(
        ofType(messageActions.MessageActionTypes.LoadMessages),
        map((action: messageActions.LoadMessages) => action.payload),
        mergeMap(user =>
            this.socketService.onMessage().pipe(
                filter(message => message.from === user.email),
                map(message => new messageActions.LoadMessageFromSocket(message)),
                catchError(err => of(new messageActions.LoadMessagesFail(err)))
            )
        )
    );
}
