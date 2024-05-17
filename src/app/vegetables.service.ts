import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Vegetable {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class VegetablesService {
  readonly #VEGETABLE_URL = 'http://localhost:3000/vegetables';
  readonly #JSON_HEADERS = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private readonly http = inject(HttpClient);

  // TODO: handle errors

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
    return this.http.post<Vegetable>(this.#VEGETABLE_URL, newVegetable, {
      headers: this.#JSON_HEADERS,
      observe: 'response',
    });
  }

  #updateVegetable(vegetable: Vegetable) {
    return this.http.put<Vegetable>(`${this.#VEGETABLE_URL}/${vegetable.id}`, vegetable, {
      headers: this.#JSON_HEADERS,
      observe: 'response',
    });
  }
}
