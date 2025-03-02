import { NavigatedData, Page } from '@nativescript/core';
import { AlarmsViewModel } from './alarms-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new AlarmsViewModel();
}