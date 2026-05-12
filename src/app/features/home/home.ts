import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styles: []
})
export class Home {
  menuOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  stats = [
    { num: '2,481', label: 'Registered' },
    { num: '347',   label: 'Responders' },
    { num: '12ms',  label: 'Avg Response' },
    { num: '99.9%', label: 'Uptime' },
  ];

  aboutItems = [
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Zone Coverage', desc: '5 city zones monitored', color: 'icon-rose' },
    { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', title: 'Roles', desc: 'Admin, Responder, Civilian', color: 'icon-teal' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Secure', desc: 'Role-based access control', color: 'icon-blue' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Fast', desc: '12ms average API response', color: 'icon-amber' },
  ];

  features = [
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Identity & Access Management',
      desc: 'Secure authentication and role-based access for Citizens, Police, Firefighters, Dispatchers, Administrators, and Compliance Officers.',
      color: 'icon-blue',
    },
    {
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      title: 'Incident Reporting',
      desc: 'Citizens report crimes, fires, and accidents in real time. Responders log case details and track resolution status across all incident types.',
      color: 'icon-rose',
    },
    {
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      title: 'Emergency Dispatch',
      desc: 'Dispatchers assign vehicles and equipment to incidents, track unit availability, and monitor response progress across the city in real time.',
      color: 'icon-red',
    },
    {
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
      title: 'Disaster & Crisis Response',
      desc: 'Coordinates multi-agency response to floods, earthquakes, and fires. Tracks crisis severity levels and records all actions taken by response teams.',
      color: 'icon-amber',
    },
    {
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      title: 'Patrol & Field Operations',
      desc: 'Police officers manage patrol schedules, log field activities, and submit reports. Area-based patrol tracking ensures full city coverage.',
      color: 'icon-blue',
    },
    {
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      title: 'Reporting & Analytics',
      desc: 'Generates dashboards and reports on incidents, patrols, crisis response, and compliance metrics to support city-wide safety decision making.',
      color: 'icon-teal',
    },
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      title: 'Compliance & Audit',
      desc: 'Ensures adherence to safety policies, tracks compliance records, and conducts audits across incident handling and dispatch operations.',
      color: 'icon-purple',
    },
    {
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      title: 'Notifications & Alerts',
      desc: 'Sends real-time alerts for incidents, dispatch updates, crisis warnings, and compliance reminders to all relevant users and responders.',
      color: 'icon-amber',
    },

  ];
}
