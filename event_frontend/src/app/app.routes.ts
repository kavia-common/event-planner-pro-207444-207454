import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventFormPageComponent } from './pages/event-form-page/event-form-page.component';
import { EventDetailPageComponent } from './pages/event-detail-page/event-detail-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'events' },
      { path: 'events', component: EventListPageComponent },
      { path: 'events/new', component: EventFormPageComponent },
      { path: 'events/:id/edit', component: EventFormPageComponent },
      { path: 'events/:id', component: EventDetailPageComponent },
      { path: 'calendar', component: CalendarPageComponent },
      { path: '**', redirectTo: 'events' },
    ],
  },
];
