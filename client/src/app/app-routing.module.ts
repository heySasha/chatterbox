import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'register',
        component: RegisterPageComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
