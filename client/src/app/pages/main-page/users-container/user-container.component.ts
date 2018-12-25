import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { SocketService } from '../../../services/socket.service';
import { User } from '../../../types';
import { Store } from '@ngrx/store';
import * as fromMessage from '../../../store/message/message.reducer';
import * as messageActions from '../../../store/message/message.actions';

@Component({
    selector: 'app-user-container',
    templateUrl: './user-container.component.html',
    styleUrls: ['./user-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {
    isOnlineTab = true;
    allUsers = [];
    onlineUsers = [];

    selectedUser = {};

    constructor(
        private ref: ChangeDetectorRef,
        private usersService: UsersService,
        private socketService: SocketService,
        private store: Store<fromMessage.State>
    ) {}

    ngOnInit() {
        this.getUsers();

        this.socketService.onUsers().subscribe(() => this.getUsers());

        this.usersService.getSelectedUser().subscribe(user => {
            this.selectedUser = user;
        });
    }

    onSelectTab(isOnlineTab: boolean) {
        this.isOnlineTab = isOnlineTab;
    }

    getUsers() {
        this.usersService.getAllUser().subscribe(users => {
            this.onlineUsers = users.filter(user => user.status === 'online');
            this.allUsers = users;
            this.ref.detectChanges();
        });
    }

    onSelectUser(user: User) {
        this.store.dispatch(new messageActions.SelectUser(user));
        this.store.dispatch(new messageActions.LoadMessages(user));
        this.usersService.selectUser(user);
    }
}
