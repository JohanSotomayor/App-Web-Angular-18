import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

//import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'sidebar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isAdminTemporal: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, /*private authService: AuthService*/) { }

  ngOnInit() {
   }

  navigateTo(url: string, relative: boolean = true) {
    let relativeUrl = relative? {relativeTo: this.route} : {}
    this.router.navigate([url], {...relativeUrl});
  }



}
