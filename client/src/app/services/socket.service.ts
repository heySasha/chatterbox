import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message, User } from '../types';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket;

    public initSocket(currentUser: User): void {
        if (currentUser) {
            this.socket = socketIo(environment.rootUrl, {
                query: { email: currentUser.email, token: currentUser.token }
            });
        }
    }

    public send(msg: Message): void {
        this.socket.emit('message', msg);
    }

    public type(email: string): void {
        this.socket.emit('type', { email });
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (msg: Message) => observer.next(msg));
        });
    }

    public onTyping(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('type', (data: any) => observer.next(data));
        });
    }

    public onUsers(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('user-event', (data: any) => observer.next(data));
        });
    }
}
