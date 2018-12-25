import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem('currentUser'))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(loginData: { email: string; password: string }) {
        return this.http
            .post<any>(`${environment.apiUrl}/login`, loginData)
            .pipe(
                map(user => {
                    if (user && user.token) {
                        localStorage.setItem(
                            'currentUser',
                            JSON.stringify(user)
                        );
                        this.currentUserSubject.next(user);
                    }

                    return user;
                })
            );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/register`, user);
    }
}
