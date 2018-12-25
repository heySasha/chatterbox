import { Component, Input } from '@angular/core';
import { Message, User } from '../../../../types';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent {
    @Input() messages: Message[];
    @Input() selectedUser: User;
    @Input() currentUser: User;
}
