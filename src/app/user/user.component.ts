import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseServiceService } from '../services/firebase-service.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  users: User[];
  mensajeError: any;
  closeResult: string;
  formUsers = new FormGroup({
    first: new FormControl('', Validators.required),
    last: new FormControl('', Validators.required),
    born: new FormControl('', Validators.required)
  });
  idDelete: string;
  idEdit: string;
  editing: boolean;

  constructor(private modalService: NgbModal, private firebaseService: FirebaseServiceService, private spinner: NgxSpinnerService) {
    this.spinner.show()
    this.loadTable()
  }

  ngOnInit(): void {
    this.users = []
    this.idEdit = ''
    this.idDelete = ''
    this.editing = false
  }

  open(content) {
    this.formUsers.reset()
    this.editing = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get controlsForm() {
    return this.formUsers.controls
  }

  loadTable() {
    this.firebaseService.getUsers().subscribe(
      (data) => {
        this.users = []
        data.forEach(
          (e: any) => {
            var u: User = {
              id: e.payload.doc.id,
              first: e.payload.doc.data().first,
              last: e.payload.doc.data().last,
              born: e.payload.doc.data().born
            }
            this.users.push(u)
          }
        )
        this.spinner.hide()

      },
      (error) => {
        console.log('error')
        this.spinner.hide()

        return error;
      }
    )
  }

  saveUser() {
    if (!this.formUsers.invalid) {
      this.firebaseService.createUser(this.formUsers.value).then(
        (resp) => {
          this.formUsers.reset()
          this.modalService.dismissAll()
        }
      ).catch(
        (error) => {
          console.log('error al guardar user')
          console.log(error)
        }
      )
    } else {
      alert('Error en el formulario')
    }
  }

  openModalEdit(context, user: User) {
    this.formUsers.setValue({
      first: user.first,
      last: user.last,
      born: user.born
    })
    this.idEdit = user.id
    this.editing = true
    console.log(this.idEdit)
    this.modalService.open(context)
  }

  updateUser() {
    if (!this.formUsers.invalid) {
      this.firebaseService.updateUser(this.idEdit, this.formUsers.value).then(
        (resp) => {
          console.log('usuario actualizado')
          this.formUsers.reset()
          this.modalService.dismissAll()
        }
      ).catch(
        (error) => {
          console.log('error al actualizar usuario')
          console.log(error)
        }
      )
    } else {
      alert('Error en el formulario')
    }
  }

  openModalDelete(context, id) {
    this.idDelete = id;
    this.modalService.open(context)
  }

  deleteUser(id) {
    this.firebaseService.deleteUser(id).then(
      (resp) => {
        console.log('user borrado')
      }
    ).catch(
      (error) => {
        console.log('error al borrar user')
        console.log(error)
      }
    )
    this.modalService.dismissAll()
  }

}
