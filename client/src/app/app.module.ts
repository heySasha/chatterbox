import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserCardComponent } from './pages/main-page/users-container/user-card/user-card.component';
import { UserListComponent } from './pages/main-page/users-container/user-list/user-list.component';
import { UserContainerComponent } from './pages/main-page/users-container/user-container.component';
import { MessageTitleComponent } from './pages/main-page/message-container/message-title/message-title.component';
import { MessageListComponent } from './pages/main-page/message-container/message-list/message-list.component';
import { SocketService } from './services/socket.service';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { FilterPipe } from './pipes/filter.pipe';
import { HeaderComponent } from './components/header/header.component';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MessageEffects } from './store/message/message.effects';
import { reducer } from './store/message/message.reducer';
import { MessageContainerComponent } from './pages/main-page/message-container/message-container.component';

@NgModule({
    declarations: [
        AppComponent,
        UserCardComponent,
        UserListComponent,
        UserContainerComponent,
        MessageTitleComponent,
        MessageListComponent,
        MessageContainerComponent,
        LoginPageComponent,
        MainPageComponent,
        RegisterPageComponent,
        HeaderComponent,
        FilterPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({messages: reducer}),
        EffectsModule.forRoot([MessageEffects]),
        StoreDevtoolsModule.instrument({
            name: 'APM Demo App DevTools',
            maxAge: 25,
            logOnly: environment.production
        })
    ],
    providers: [
        SocketService,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
