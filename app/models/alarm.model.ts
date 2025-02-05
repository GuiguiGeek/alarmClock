export interface Alarm {
    id: string;
    time: string;
    label: string;
    isEnabled: boolean;
    sound: string;
    volume: number;
    vibrate: boolean;
    snoozeEnabled: boolean;
    snoozeDuration: number;
    repeatPattern: RepeatPattern;
}

export interface RepeatPattern {
    type: 'once' | 'daily' | 'weekly' | 'biweekly';
    days?: number[]; // 0-6 for Sunday-Saturday
    weeks?: number[]; // 1-2 for biweekly
}

export interface AlarmSound {
    id: string;
    name: string;
    url: string;
    isCustom: boolean;
}

export interface AlarmStatistics {
    totalAlarms: number;
    missedAlarms: number;
    snoozeCount: number;
    averageSnoozeTime: number;
}