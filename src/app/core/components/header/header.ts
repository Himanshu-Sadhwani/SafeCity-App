import { Component } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIcon, MaterialModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {}
