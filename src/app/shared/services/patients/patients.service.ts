import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Store } from '../../../../store';

import { Observable } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

export interface Patient {
    id: string,
    assessment_date: string,
    phone: string,
    age: number,
    gender: string,
    first_name: string,
    last_name: string,
    medications: [],
    residence: string,
    exposure_community: boolean,
    exposure_individual: boolean,
    exposure_travel: boolean,
    conditions: [],
    symptom_onset: string,
    diagnosis: boolean,
    temp: number,
    cough: boolean,
    short_breath: boolean,
    pregnant: boolean,
    risk: number,
    count: number,
    conditionCount: number,
    hide: boolean
}

@Injectable()
export class PatientsService {

    patients = [];

    patientsCol: AngularFirestoreCollection<Patient> = this.db.collection<Patient>(`patients`, ref => ref.orderBy('diagnosis', 'desc'));

    patients$ = this.patientsCol.stateChanges(['added', 'modified', 'removed'])
        .pipe(map(actions => actions.map(a => {
            console.log('ACTION', a);
            if (a.type == 'removed') {
                ///remove based on note.id
                const patient = a.payload.doc.data() as Patient;
                patient.id = a.payload.doc.id;
                return;
            }
            if (a.type == 'added' || a.type == 'modified') {
                const patient = a.payload.doc.data() as Patient;
                patient.id = a.payload.doc.id;
                this.getRisk(patient);
                this.symptomCount(patient);
                const exists = this.patients.find(n => n.id === patient.id)
                if (!exists) {
                    this.patients.push(patient);
                }
                if (exists) {
                    let index = this.patients.indexOf(exists);
                    this.patients[index] = patient;
                }
            }
            return this.store.set('patients', this.patients)
        })))

    constructor(
        private store: Store,
        private db: AngularFirestore,
    ) { }

    getPatient(id: string) {
        return this.store.select<Patient[]>('patients')
            .pipe(
                filter(Boolean),
                map((patients: Patient[]) => patients.find((patient: Patient) => patient.id === id))
            );
    }

    getRisk(patient: Patient) {
        if (patient.diagnosis || patient.temp > 100.4 && patient.cough && patient.short_breath) {
            patient.risk = 3 + (patient.age / 100)
        } else if (patient.exposure_community || patient.exposure_travel || patient.exposure_individual || patient.temp > 100.4 || patient.cough || patient.short_breath) {
            patient.risk = 2 + (patient.age / 100)
        } else {
            patient.risk = 1 + ( patient.age / 100)
        }
    }

    symptomCount(patient: Patient) {
        patient.count = 0;
        if (patient.temp > 100.4) {
            patient.count += 1;
        }
        if (patient.cough) {
            patient.count += 1;
        }
        if (patient.short_breath) {
            patient.count += 1;
        }
    }

    // addMeal(meal: Meal) {
    //     return this.db.list(`meals/${this.uid}`).push(meal);
    // }

    // updateMeal(key: string, meal: Meal) {
    //     return this.db.object(`meals/${this.uid}/${key}`).update(meal);
    // }

    // removeMeal(key: string) {
    //     return this.db.list(`meals/${this.uid}`).remove(key);
    // }

}