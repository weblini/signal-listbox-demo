import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Vegetable {
  id: number;
  name: string;
  description: string;
}

// TODO: Call API to get available vegetables

@Injectable({
  providedIn: 'root',
})
export class VegetablesService {
  readonly #VEGETABLE_URL = 'http://localhost:3000/vegetables';

  http = inject(HttpClient);

  getVegetables() {
    return this.http.get<Vegetable[]>(this.#VEGETABLE_URL);
  }
}
