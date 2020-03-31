import { Observable } from 'rxjs';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { pluck } from 'rxjs/operators';

import { Patient } from './app/shared/services/patients/patients.service';
import { Injectable } from "@angular/core";

export interface State {
  patients: Patient[]
}

const state: State = {
  patients: undefined
};

@Injectable()
export class Store {

  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }

}
