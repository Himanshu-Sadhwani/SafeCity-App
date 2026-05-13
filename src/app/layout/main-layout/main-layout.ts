import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
  <div class="flex min-h-screen">
    <app-sidebar />
    <main class="flex-1 p-6 overflow-x-auto">
      <router-outlet />
    </main>
  </div>
  `,
})
export class MainLayout {}
