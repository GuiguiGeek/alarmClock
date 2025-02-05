import { Observable, BehaviorSubject } from 'rxjs';
import { LocalNotifications } from '@nativescript/local-notifications';
import { ApplicationSettings } from '@nativescript/core';
import { Alarm, AlarmStatistics } from '../models/alarm.model';

export class AlarmService {
    private static instance: AlarmService;
    private alarms = new BehaviorSubject<Alarm[]>([]);
    private statistics: AlarmStatistics = {
        totalAlarms: 0,
        missedAlarms: 0,
        snoozeCount: 0,
        averageSnoozeTime: 0
    };

    static getInstance(): AlarmService {
        if (!AlarmService.instance) {
            AlarmService.instance = new AlarmService();
        }
        return AlarmService.instance;
    }

    getAlarms(): Observable<Alarm[]> {
        return this.alarms.asObservable();
    }

    addAlarm(alarm: Alarm): void {
        const currentAlarms = this.alarms.getValue();
        this.alarms.next([...currentAlarms, alarm]);
        this.scheduleAlarm(alarm);
        this.saveAlarms();
        this.updateStatistics();
    }

    updateAlarm(alarm: Alarm): void {
        const currentAlarms = this.alarms.getValue();
        const index = currentAlarms.findIndex(a => a.id === alarm.id);
        if (index !== -1) {
            currentAlarms[index] = alarm;
            this.alarms.next([...currentAlarms]);
            this.scheduleAlarm(alarm);
            this.saveAlarms();
        }
    }

    deleteAlarm(id: string): void {
        const currentAlarms = this.alarms.getValue();
        this.alarms.next(currentAlarms.filter(alarm => alarm.id !== id));
        this.cancelAlarm(id);
        this.saveAlarms();
    }

    private scheduleAlarm(alarm: Alarm): void {
        if (!alarm.isEnabled) return;

        LocalNotifications.schedule([{
            id: parseInt(alarm.id),
            title: alarm.label || 'Alarm',
            body: `Alarm for ${alarm.time}`,
            sound: alarm.sound,
            at: this.getNextAlarmTime(alarm)
        }]);
    }

    private cancelAlarm(id: string): void {
        LocalNotifications.cancel(parseInt(id));
    }

    private getNextAlarmTime(alarm: Alarm): Date {
        // Implementation for calculating next alarm time based on repeat pattern
        const [hours, minutes] = alarm.time.split(':').map(Number);
        const now = new Date();
        const alarmTime = new Date();
        alarmTime.setHours(hours, minutes, 0, 0);

        if (alarmTime <= now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }

        return alarmTime;
    }

    private saveAlarms(): void {
        const alarmsJson = JSON.stringify(this.alarms.getValue());
        ApplicationSettings.setString('alarms', alarmsJson);
    }

    private loadAlarms(): void {
        const alarmsJson = ApplicationSettings.getString('alarms', '[]');
        const alarms = JSON.parse(alarmsJson);
        this.alarms.next(alarms);
    }

    getStatistics(): AlarmStatistics {
        return this.statistics;
    }

    private updateStatistics(): void {
        this.statistics.totalAlarms = this.alarms.getValue().length;
        // Save statistics
        ApplicationSettings.setString('alarmStats', JSON.stringify(this.statistics));
    }
}