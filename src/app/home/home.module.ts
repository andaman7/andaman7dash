import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { FilterPropsComponent } from './filter-props/filter-props.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  entryComponents: [PatientDetailComponent, FilterPropsComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage, PatientDetailComponent, FilterPropsComponent]
})
export class HomePageModule {}
