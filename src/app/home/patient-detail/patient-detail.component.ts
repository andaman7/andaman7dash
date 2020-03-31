import { Component, OnInit } from '@angular/core';
import { Store } from '../../../store';

import { Observable, Subscription } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Patient, PatientsService } from '../../shared/services/patients/patients.service';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-patient-detail',
  templateUrl: 'patient-detail.component.html',
  styleUrls: ['patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
  subscriptions: Subscription[];
  patients$: Observable<Patient[]>;
  patient$: Observable<Patient>;
  patientId: string;
  constructor(
    private store: Store,
    private patientsService: PatientsService,
    public modalController: ModalController,
    public navParams: NavParams
  ) {}

  ionViewWillEnter() {
    this.patientId = this.navParams.get('patientId');
    this.patient$ = this.patientsService.getPatient(this.patientId);
  }

  dismiss() {
    this.modalController.dismiss({
        response: 'dismissed'
    });
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
