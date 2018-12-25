import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    active = false;

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            this.active = !!user;
        });
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
