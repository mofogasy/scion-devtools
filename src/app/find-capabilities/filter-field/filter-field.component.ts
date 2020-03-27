import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

export type Filter = string | KeyValuePair;

export interface KeyValuePair {
  key?: string;
  value?: string;
}

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss']
})
export class FilterFieldComponent {

  @Input()
  public title: string;

  @Input()
  public type: 'value' | 'key-value' = 'value';

  @Output()
  public filter: EventEmitter<Filter[]> = new EventEmitter<Filter[]>();

  public keyFC = new FormControl();
  public valueFC = new FormControl();

  public _filters: Set<Filter> = new Set<Filter>();

  public get filters(): Filter[] {
    return Array.from(this._filters.values());
  }

  public onAddFilterClick() {
    const key = this.keyFC.value;
    const value = this.valueFC.value;
    this.keyFC.setValue('');
    this.valueFC.setValue('');
    if (this.type === 'value') {
      // TODO: set focus
      this._filters.add(value);
    } else if (this.type === 'key-value') {
      if (key) {
        this._filters.add({key, value});
      } else {
        this._filters.add({});
      }
    }
    this.filter.emit(Array.from(this._filters.values()));
  }

  public onRemoveFilter(filter: Filter) {
    this._filters.delete(filter);
    this.filter.emit(Array.from(this._filters.values()));
  }
}
