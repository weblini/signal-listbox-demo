import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Vegetable } from '@data/models';


@Injectable({
  providedIn: 'root',
})
export class VegetablesService {
  readonly #VEGETABLE_URL = 'http://localhost:3000/vegetables';

  private readonly http = inject(HttpClient);

  getVegetables() {
    return this.http.get<Vegetable[]>(this.#VEGETABLE_URL);
  }

  deleteVegetable(id: number) {
    return this.http.delete<Vegetable>(this.#VEGETABLE_URL + '/' + id);
  }

  saveVegetable(vegetable: Vegetable) {
    return vegetable.id ? this.#updateVegetable(vegetable) : this.#addVegetable(vegetable)
  }

  #addVegetable(newVegetable: Vegetable) {
    return this.http.post<Vegetable>(this.#VEGETABLE_URL, newVegetable);
  }

  #updateVegetable(vegetable: Vegetable) {
    return this.http.put<Vegetable>(`${this.#VEGETABLE_URL}/${vegetable.id}`, vegetable);
  }
}
