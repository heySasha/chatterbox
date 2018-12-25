import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
    @Input() user;
    @HostBinding('class.selected') selected: boolean = false;

    constructor(private usersService: UsersService) {}

    ngOnInit() {
        this.usersService.getSelectedUser().subscribe(selectedUser => {
            this.selected = this.user._id === selectedUser._id;
        });
    }
}
