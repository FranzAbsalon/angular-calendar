// Angular Core
import { Component, signal, ViewChild, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

// FullCalendar
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

// Angular Primitives
import { NgpInput } from 'ng-primitives/input';
import { NgpSearchField, NgpSearchFieldClear } from 'ng-primitives/search';
import { NgpButton } from 'ng-primitives/button';

// Angular Icons
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlusCircleSolid } from '@ng-icons/heroicons/solid';
import { heroChevronDownMini } from '@ng-icons/heroicons/mini';
import {
  heroMagnifyingGlass,
  heroUserCircle,
  heroFunnel,
  heroChevronRight,
  heroChevronLeft,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    NgIcon,
    NgpInput,
    NgpSearchField,
    NgpSearchFieldClear,
    NgpButton,
    FormsModule,
    FullCalendarModule,
    MatSelectModule,
  ],
  viewProviders: [
    provideIcons({
      heroPlusCircleSolid,
      heroMagnifyingGlass,
      heroUserCircle,
      heroChevronDownMini,
      heroFunnel,
      heroChevronRight,
      heroChevronLeft,
    }),
  ],
})

export class AppComponent implements AfterViewInit {
  title = 'my-angular-app';

  readonly query = signal<string>('');

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarTitle: string = '';
  selectedView: string = 'timeGridWeek';
  

  calendarOptions: CalendarOptions = {
    initialView: this.selectedView,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: false,
    selectable: true,
    editable: true,
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
    },
    events: [
      { title: 'Team Meeting', start: '2025-02-02T10:00:00', end: '2025-02-02T10:30:00', color: '#007bff' },
      { title: 'Lunch Break', start: '2025-02-02T12:00:00', end: '2025-02-02T12:30:00', color: '#ffc107' },
      { title: 'Client Call', start: '2025-02-03T14:00:00', end: '2025-02-03T14:30:00', color: '#28a745' },
      { title: 'Conference', start: '2025-02-04T09:00:00', end: '2025-02-04T09:30:00', color: '#6f42c1' },
      { title: 'Workshop', start: '2025-02-05T10:00:00', end: '2025-02-05T10:30:00', color: '#007bff' },
      { title: 'Team Meeting', start: '2025-02-06T13:00:00', end: '2025-02-06T13:30:00', color: '#ffc107' },
      { title: 'Lunch Break', start: '2025-02-07T14:00:00', end: '2025-02-07T14:30:00', color: '#28a745' },
      { title: 'Client Call', start: '2025-02-08T15:00:00', end: '2025-02-08T15:30:00', color: '#6f42c1' },
      { title: 'Conference Debrief', start: '2025-02-09T08:00:00', end: '2025-02-09T08:30:00', color: '#007bff' },
      { title: 'Team Building Activity', start: '2025-02-10T11:00:00', end: '2025-02-10T11:30:00', color: '#ffc107' },
      { title: 'End of Day Review', start: '2025-02-11T16:00:00', end: '2025-02-11T16:30:00', color: '#28a745' },
      { title: 'Project Update', start: '2025-02-12T09:00:00', end: '2025-02-12T09:30:00', color: '#6f42c1' }
    ],    
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.updateTitle.bind(this)
  };

  ngAfterViewInit() {
    this.updateTitle(); // Set initial title after view is ready
    setTimeout(() => {
      this.changeDetectorRef.detectChanges(); // Force re-render
    }, 100);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize')); // Simulate a resize event
    }, 200);
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().updateSize(); // Force FullCalendar to update layout
      }
    }, 200);
  }

  updateTitle() {
    const calendarApi = this.calendarComponent.getApi();
    this.calendarTitle = calendarApi.view.title; // Fetch and store the title
  }

  private _snackBar = inject(MatSnackBar);

  handleEventClick(info: any) {
    const start = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    this._snackBar.open(`${info.event.title} (Time: ${start})`, '', {
      duration: 5000,
    });
  }

  // handleEventClick(info: any) {
  //   alert('Event: ' + info.event.title);
  // }

  goToNext() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }

  goToPrev() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
  }

  goToToday() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.today();
  }

  addEvent() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.addEvent({
      title: 'New Event',
      start: new Date()
    });
  }

  changeView(view: string) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView(view);
    this.selectedView = view;
    this.updateTitle();
  }

  getViewLabel(view: string): string {
    const labels: { [key: string]: string } = {
      dayGridMonth: 'Month',
      timeGridWeek: 'Week',
      timeGridDay: 'Day'
    };
    return labels[view] || 'View';
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}
}
