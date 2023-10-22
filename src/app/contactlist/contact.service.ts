import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from './contact'; // импортируем ранее реализованный Contact
import { Observable, catchError, retry } from 'rxjs';
@Injectable()
export class ServiceAPI {
  private APIUrl = 'http://localhost:8080/api/contacts'; // путь для сервиса
  constructor(private http: HttpClient) { }
  // создание нового контакта
  createContact(newContact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.APIUrl, newContact);
  }

  // получение данных о контактах
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.APIUrl);
  }

  // удаление контакта по id
  deleteContact(delContactId: String): Observable<String> {
    return this.http.delete<String>(this.APIUrl + '/' + delContactId);
  }

  // обновление контакта по id
  updateContact(putContact: Contact): Observable<Contact> {
    return this.http.put<Contact>(this.APIUrl + '/' + putContact._id, putContact);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} – ${error.statusText}` : 'Ошибка сервера';
    console.error(errMsg); // Вывод сообщения в консоль браузера
    return errMsg;
  }
}