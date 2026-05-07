import { Component } from '@angular/core';
import { MatNavList } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { MaterialModule } from '../../../shared/material.module';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatNavList, MatIcon, MaterialModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {}
