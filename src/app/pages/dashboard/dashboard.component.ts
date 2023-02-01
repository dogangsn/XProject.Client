import { Component, OnInit } from '@angular/core';
import { IconUserModel } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users1: Array<IconUserModel> = [
    { name: 'Emma Smith', avatar: './assets/media/avatars/300-6.jpg' },
    { name: 'Rudy Stone', avatar: './assets/media/avatars/300-1.jpg' },
    { name: 'Susan Redwood', initials: 'S', color: 'primary' },
  ];
  
  users8 = [
    { name: 'Emma Smith', avatar: './assets/media/avatars/300-6.jpg' },
    { name: 'Rudy Stone', avatar: './assets/media/avatars/300-1.jpg' },
    { name: 'Susan Redwood', initials: 'S', color: 'primary' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
