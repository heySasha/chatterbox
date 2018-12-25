import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../types';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
    searchText: string;

    @Input() users = [];
    @Input() selectedUser: User;
    @Output() selectUser: EventEmitter<any> = new EventEmitter();
}
