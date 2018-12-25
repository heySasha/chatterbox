import * as fromRoot from '../app.state';
import { Message, User } from '../../types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageActions, MessageActionTypes } from './message.actions';

export interface State extends fromRoot.State {
    messageState: MessageState;
}

const getMessageFeatureState = createFeatureSelector<MessageState>('messages');

export const getMessages = createSelector(
    getMessageFeatureState,
    state => state.messages
);

export interface MessageState {
    messages: Message[];
    selectedUser: User
}

const initialState: MessageState = {
    messages: [],
    selectedUser: null
};

export function reducer(state = initialState, action: MessageActions): MessageState {
    switch (action.type) {
        case MessageActionTypes.SendMessage:
            return {
                ...state,
                messages: state.messages.concat([action.payload])
            };

        case MessageActionTypes.LoadMessageFromSocket:
            return {
                ...state,
                messages: state.messages.concat([action.payload])
            };

        case MessageActionTypes.LoadMessagesSuccess:
            return {
                ...state,
                messages: action.payload
            };

        case MessageActionTypes.LoadMessagesFail:
            console.error(action.payload);
            return state;

        case MessageActionTypes.SelectUser:
            return {
                ...state,
                selectedUser: action.payload
            };

        default:
            return state;
    }
}