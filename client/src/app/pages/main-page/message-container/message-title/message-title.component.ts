import { Component, Input } from '@angular/core';
import { User } from '../../../../types';

@Component({
    selector: 'app-message-title',
    templateUrl: './message-title.component.html',
    styleUrls: ['./message-title.component.scss']
})
export class MessageTitleComponent {
    @Input() selectedUser: User;
}
