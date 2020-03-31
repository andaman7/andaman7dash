import { Component, OnInit } from '@angular/core';
import { ModalController, Config } from '@ionic/angular';

import { Observable, Subscription } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Store } from '../../store';
import { Patient, PatientsService } from '../shared/services/patients/patients.service';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { FilterPropsComponent } from './filter-props/filter-props.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  sortType: string;
  sortReverse: boolean = true;
  ios: boolean;
  queryText = '';
  showSearchbar: boolean;
  subscriptions: Subscription[];
  patients$: Observable<Patient[]>;
  filteredPatients: Patient[];
  filterChips = [];
  filterProps = [
    {
        name: "Tested Positive",
        id: "diagnosis",
        isChecked: false
    },
    {
        name: "Community Exposure",
        id: "exposure_community",
        isChecked: false
    },
    {
        name: "Individual Exposure",
        id: "exposure_individual",
        isChecked: false
    },
    {
        name: "Travel Exposure",
        id: "exposure_travel",
        isChecked: false
    },
    {
        name: "Fever",
        id: "temp",
        isChecked: false
    },
    {
        name: "Cough",
        id: "cough",
        isChecked: false
    },
    {
        name: "Shortness of Breath",
        id: "short_breath",
        isChecked: false
    },
    {
        name: "Senior",
        id: "age",
        isChecked: false
    },
    {
        name: "Pre-existing Conditions",
        id: "conditions",
        isChecked: false
    },
    {
        name: "Pregnant",
        id: "pregnant",
        isChecked: false
    }
]

  constructor(
    private store: Store,
    private patientsService: PatientsService,
    private modalController: ModalController,
    public config: Config
  ) { }

  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
    this.patients$ = this.store.select<Patient[]>('patients');
    this.filterPatients('');
    this.sortPatients('risk');
    this.subscriptions = [
      this.patientsService.patients$.subscribe()
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  dynamicSort(property) {
    let sortOrder = -1;
    if (this.sortReverse) {
      sortOrder = 1;
    }
    return function (a, b) {
      let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  filterPatients(search: string) {
    this.patients$.pipe(map(patients => {
      if (patients) {
        if (search.length) {
          this.filteredPatients = patients.filter(o =>
            Object.keys(o).some(k => {
              if (typeof o[k] === 'string')
                return o[k].toLowerCase().includes(search.toLowerCase());
            })
          );
        } else {
          this.filteredPatients = patients;
        }
      }
    })).subscribe()
  }

  sortPatients(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.patients$.pipe(map(patients => {
      if (patients) {
        this.filteredPatients.sort(this.dynamicSort(property));
      }
    })).subscribe()
  }

  async patientDetail(id: string) {
    const modal = await this.modalController.create({
      component: PatientDetailComponent,
      componentProps: {
        'patientId': id
      },
      cssClass: 'custom-modal-css'
    });
    modal.onWillDismiss().then(data => {
      //this.data = data.data;
    });
    return await modal.present();
  }

  async presentFilter() {
    const modal = await this.modalController.create({
      component: FilterPropsComponent,
      componentProps: { filterProps: this.filterProps },
      cssClass: 'custom-modal-css'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterProps = data;
      this.updatePatients();
    }
  }

  removeFilter(f) {
    var chipIndex = this.filterChips.indexOf(f);
    this.filterChips.splice(chipIndex, 1);
    this.filterProps.find((filter) => filter.name === f).isChecked = false;
    this.updatePatients();    
  }

  updatePatients() {
    this.patients$.pipe(map(patients => {
      if (patients) {
        patients.forEach(p => {
          p.hide = false;
          this.filterChips = [];
          this.filterProps.forEach(filter => {
            if (filter.isChecked) {
              this.filterChips.push(filter.name);
              if (filter.id !== 'age' && filter.id !== 'temp' && filter.id !== 'conditions') {
                if (p[filter.id] == false) {
                  p.hide = true;
                }
              } else if (filter.id == 'conditions') {
                if (!p[filter.id].length) {
                  p.hide = true;
                }
              } else if (filter.id == 'age' && p[filter.id] < 65) {
                p.hide = true;
              } else if (filter.id == 'temp' && p[filter.id] < 100.4) {
                p.hide = true;
              }
            }
          })
        })
      }
    })).subscribe()
  }


}
