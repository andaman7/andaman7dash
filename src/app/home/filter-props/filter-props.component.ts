import { Component, OnInit } from '@angular/core';
import { Store } from '../../../store';

import { Observable, Subscription } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Patient, PatientsService } from '../../shared/services/patients/patients.service';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
    selector: 'app-filter-props',
    templateUrl: 'filter-props.component.html',
    styleUrls: ['filter-props.component.scss'],
})
export class FilterPropsComponent implements OnInit {
    subscriptions: Subscription[];
    patients$: Observable<Patient[]>;
    patient$: Observable<Patient>;
    patientId: string;
    filterPropNames: string[];
    props = [];
    constructor(
        private store: Store,
        private patientsService: PatientsService,
        public modalController: ModalController,
        public navParams: NavParams
    ) { }

    ionViewWillEnter() {
        this.filterPropNames = this.navParams.get('filterProps');
    }

    //isChecked: (filterPropNames.indexOf(prop.name) === -1)


    dismiss() {
        // this.props.forEach(p => {
        //     if (p.isChecked) {
        //         this.filterPropNames.push(p.id);
        //     }
        // })
        this.modalController.dismiss(this.filterPropNames);
    }

    ngOnInit() {
        this.patients$ = this.store.select<Patient[]>('patients');
        this.subscriptions = [
            // this.patientsService.patients$.subscribe()
        ]
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}