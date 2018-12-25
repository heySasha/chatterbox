import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../types';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    selectedUser: EventEmitter<any> = new EventEmitter();

    constructor(private http: HttpClient) {}

    getAllUser(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    selectUser(user: any) {
        this.selectedUser.emit(user);
    }

    getSelectedUser() {
        return this.selectedUser;
    }
}
