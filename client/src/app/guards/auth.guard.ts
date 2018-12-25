import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private socketService: SocketService,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            this.socketService.initSocket(currentUser);
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
