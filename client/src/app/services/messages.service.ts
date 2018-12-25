import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { concat, merge, Observable } from 'rxjs';
import { Message } from '../types';
import { SocketService } from './socket.service';
import { concatMap, map, reduce, take, withLatestFrom } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    public messages: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private socketService: SocketService
    ) {
        // this.socketService
        //     .onMessage()
        //     .subscribe(msg => {
        //         console.log('MessagesService-Socket', msg);
        //     });
    }

    getMessages(user: any): Observable<Message[]> {
        return this.http
            .get<Message[]>(`${environment.apiUrl}/messages/${user.email}`)
            .pipe(take(1));
        // return merge(
        //     this.http.get<Message[]>(`${environment.apiUrl}/messages/${user.email}`),
        //     this.socketService.onMessage()
        // );

        // return this.socketService.onMessage().pipe(
        //     reduce((acc, val) => acc.concat(val))
        // );

        // return this.http.get<Message[]>(`${environment.apiUrl}/messages/${user.email}`).pipe(
        //     withLatestFrom(this.socketService.onMessage()),
        //     map(([first, second]) => first.concat(second))
        // );

        // return concat(
        //     this.http.get<Message[]>(`${environment.apiUrl}/messages/${user.email}`),
        //     this.socketService.onMessage()
        // );

        // this.http.get<Message[]>(`${environment.apiUrl}/messages/${user.email}`).pipe(
        //     concat(this.socketService.onMessage())
        // );

        // return this.http.get<Message[]>(
        //     `${environment.apiUrl}/messages/${user.email}`
        // )
    }
}
