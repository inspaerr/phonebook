import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactService]
})
export class ContactListComponent implements OnInit {
  contacts!: Contact[]
  selectedContact!: Contact
  constructor(private contactService: ContactService) { }
  ngOnInit() {
    this.contactService.getContacts()
    .subscribe((contacts: Contact[]) => {
        this.contacts = contacts.map((contact) => {
          if (!contact.telephone) {
            contact.telephone = {
              mobile: '',
              home: ''
            }
          }
          return contact;
        });
      });
  }
  private getIndexOfContact = (contactId: String) => {
    return this.contacts.findIndex((contact) => {
      return contact._id === contactId;
    });
  }
  selectContact(contact: Contact | null) {
    if (contact) {
      this.selectedContact = contact
    }
  }
  createNewContact() {
    var contact: Contact = {
      username: '',
      email: '',
      telephone: {
        home: '',
        mobile: ''
      }
    };
    // По умолчанию вновь созданный контакт будет иметь выбранное состояние.
      this.selectContact(contact);
  }
  deleteContact = (contactId: String) => {
    var idx = this.getIndexOfContact(contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectContact(null);
    }
    return this.contacts;
  }
  addContact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectContact(contact);
    return this.contacts;
  }
  updateContact = (contact: Contact) => {
    if (!contact._id){
      return this.contacts;
    }
    var idx = this.getIndexOfContact(contact._id);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
    return this.contacts;
  }
}