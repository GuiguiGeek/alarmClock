import { Observable } from '@nativescript/core';
import { Alarm } from '../../models/alarm.model';
import { AlarmService } from '../../services/alarm.service';

export class AlarmsViewModel extends Observable {
    private alarmService: AlarmService;
    private _alarms: Alarm[] = [];
    private _isDarkTheme = false;

    constructor() {
        super();
        
        this.alarmService = AlarmService.getInstance();
        this.alarmService.getAlarms().subscribe(alarms => {
            this._alarms = alarms;
            this.notifyPropertyChange('alarms', alarms);
        });
    }

    get alarms(): Alarm[] {
        return this._alarms;
    }

    get isDarkTheme(): boolean {
        return this._isDarkTheme;
    }

    toggleTheme() {
        this._isDarkTheme = !this._isDarkTheme;
        this.notifyPropertyChange('isDarkTheme', this._isDarkTheme);
    }

    onAddAlarm() {
        const newAlarm: Alarm = {
            id: Date.now().toString(),
            time: '07:00',
            label: 'New Alarm',
            isEnabled: true,
            sound: 'default',
            volume: 1,
            vibrate: true,
            snoozeEnabled: true,
            snoozeDuration: 5,
            repeatPattern: {
                type: 'once'
            }
        };
        
        this.alarmService.addAlarm(newAlarm);
    }

    onToggleAlarm(args: { object: any }) {
        const alarm = args.object.bindingContext as Alarm;
        alarm.isEnabled = !alarm.isEnabled;
        this.alarmService.updateAlarm(alarm);
    }

    onDeleteAlarm(id: string) {
        this.alarmService.deleteAlarm(id);
    }

    onSettings() {
        // TODO: Navigate to settings page
        console.log('Settings tapped');
    }
}