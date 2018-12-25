import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss', '../styles/form.scss']
})
export class LoginPageComponent {
    loginForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]]
    });

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    onLogin() {
        if (this.loginForm.invalid) {
            return;
        }

        this.authService
            .login(this.loginForm.getRawValue())
            .pipe(first())
            .subscribe(
                () => {
                    this.router.navigate(['/']);
                },
                error => {
                    console.error(error);
                }
            );
    }
}
