import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss', '../styles/form.scss']
})
export class RegisterPageComponent {
    registerForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirm: [null, [Validators.required]]
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

    onRegister() {
        if (this.registerForm.invalid) {
            return;
        }

        this.authService
            .register(this.registerForm.getRawValue())
            .pipe(first())
            .subscribe(
                () => {
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log(error);
                }
            );
    }
}
