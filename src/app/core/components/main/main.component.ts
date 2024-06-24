import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { SidebarComponent } from '@core/components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, NavbarComponent, MatSidenavModule],
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild("sidebar") sidebar?: MatDrawer
  isShowSidebar: boolean = false;
  
  constructor() { }

  ngOnInit() {
    //this.sessionTimeoutService.checkSession();
  }

  showSidebar() {
    this.sidebar?.toggle();
    this.isShowSidebar = !this.isShowSidebar;
  }

}
