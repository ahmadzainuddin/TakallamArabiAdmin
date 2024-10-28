import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private baseUrl = 'https://dividen.cbp.com.my/dev/ta'; // Your PHP API base URL

  constructor(private http: HttpClient) { }

  getAyat(page: number, searchMelayu: string = '', searchEnglish: string = ''): Observable<any> {
    let url = `${this.baseUrl}/getAyat.php?page=${page}`;

    // Append search parameters if they exist
    if (searchMelayu) {
      url += `&melayu=${searchMelayu}`;
    }
    if (searchEnglish) {
      url += `&english=${searchEnglish}`;
    }

    return this.http.get(url);
  }

  addAyat(ayat: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addAyat.php`, ayat);
  }

  editAyat(ayat: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/editAyat.php`, ayat);
  }

  deleteAyat(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/deleteAyat.php?id=${id}`);
  }
}
