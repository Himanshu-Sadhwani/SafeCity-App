import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, HeaderComponent, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent{}
