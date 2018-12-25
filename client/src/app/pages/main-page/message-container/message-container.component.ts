import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Message, User } from '../../../types';
import { Subject } from 'rxjs';
import { SocketService } from '../../../services/socket.service';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { select, Store } from '@ngrx/store';
import * as fromMessage from '../../../store/message/message.reducer';
import { filter, takeUntil } from 'rxjs/operators';
import * as messageActions from '../../../store/message/message.actions';

@Component({
    selector: 'app-message-container',
    templateUrl: './message-container.component.html',
    styleUrls: ['./message-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageContainerComponent implements OnInit {
    content: string;
    currentUser: User;
    selectedUser: User;
    messages: any[] = [];
    isShow = false;

    private unsubscribe$ = new Subject();

    constructor(
        private socketService: SocketService,
        private authService: AuthService,
        private usersService: UsersService,
        private ref: ChangeDetectorRef,
        private store: Store<fromMessage.State>
    ) {
    }

    ngOnInit() {
        this.store.pipe(select(fromMessage.getMessages)).subscribe(messages => {
            this.messages = messages;
            this.ref.detectChanges();
        });

        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });

        this.usersService
            .getSelectedUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => {
                this.selectedUser = user;
                this.ref.detectChanges();


                this.socketService
                    .onTyping()
                    .pipe(
                        takeUntil(this.unsubscribe$),
                        filter(msg => msg.email === this.selectedUser.email)
                    )
                    .subscribe(() => {
                        this.isShow = true;
                        this.ref.detectChanges();

                        setTimeout(() => {
                            this.isShow = false;
                            this.ref.detectChanges();
                        }, 700);
                    });
            });
    }

    onSend() {
        const msg: Message = {
            from: this.currentUser.email,
            to: this.selectedUser.email,
            content: this.content,
            timestamp: Date.now()
        };

        this.socketService.send(msg);
        this.store.dispatch(new messageActions.SendMessage(msg));

        this.content = '';
    }

    onType() {
        this.socketService.type(this.selectedUser.email);
    }
}