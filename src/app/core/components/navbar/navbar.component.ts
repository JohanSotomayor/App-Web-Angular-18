import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  standalone: true,
  selector: 'navbar',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output('showSidebar') showSidebarEvent = new EventEmitter<boolean>;
  isShowSidebar: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  showSidebar() {
    this.isShowSidebar = !this.isShowSidebar;
    this.showSidebarEvent.emit(this.isShowSidebar);
  }

}
