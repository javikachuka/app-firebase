import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FirebaseServiceService } from '../services/firebase-service.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Product} from '../interfaces/product'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products : Product[] ;
  mensajeError : any ;
  closeResult: string;
  formProducts = new FormGroup({
    name : new FormControl('', Validators.required) ,
    description : new FormControl('', Validators.required) ,
    price : new FormControl('', Validators.required ),
    linkPhoto : new FormControl('', Validators.required )
  }) ;
  idDelete : string ;
  idEdit : string ;
  editing : boolean ;

  constructor(private modalService: NgbModal, private firebaseService : FirebaseServiceService, private spinner: NgxSpinnerService) {
    this.spinner.show()
    this.loadTable()
  }

  ngOnInit(): void {
    this.products = []
    this.idEdit = ''
    this.idDelete = ''
    this.editing = false
  }

  open(content) {
    this.formProducts.reset()
    this.editing = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

  get controlsForm (){
    return this.formProducts.controls
  }

  loadTable(){
    this.firebaseService.getProducts().subscribe(
      (data) => {
        this.products = []
        data.forEach(
          (e: any) => {
            var u:Product = {
              id: e.payload.doc.id,
              name: e.payload.doc.data().name,
              description: e.payload.doc.data().description,
              price: e.payload.doc.data().price,
              linkPhoto: e.payload.doc.data().linkPhoto
            }
            this.products.push(u)
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

  saveProduct(){
    if(!this.formProducts.invalid){
      this.firebaseService.createProduct(this.formProducts.value).then(
        (resp) => {
          this.formProducts.reset()
          this.modalService.dismissAll()
        }
      ).catch(
        (error) => {
          console.log('error al guardar producto')
          console.log(error)
        }
      )
    }else{
      alert('Error en el formulario')
    }
  }

  openModalEdit(context, product: Product){
    this.formProducts.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      linkPhoto: product.linkPhoto
    })
    this.idEdit = product.id
    this.editing = true
    console.log(this.idEdit)
    this.modalService.open(context)
  }

  updateProduct(){
    if(!this.formProducts.invalid){
      this.firebaseService.updateProduct(this.idEdit, this.formProducts.value).then(
        (resp) => {
          console.log('producto actualizado')
          this.formProducts.reset()
          this.modalService.dismissAll()
        }
      ).catch(
        (error) => {
          console.log('error al actualizar producto')
          console.log(error)
        }
      )
    }else{
      alert('Error en el formulario')
    }
  }

  openModalDelete(context, id){
    this.idDelete = id ;
    this.modalService.open(context)
  }

  deleteProduct(id){
    this.firebaseService.deleteProduct(id).then(
      (resp) => {
        console.log('producto borrado')
      }
    ).catch(
      (error) => {
        console.log('error al borrar producto')
        console.log(error)
      }
    )
    this.modalService.dismissAll()
  }

}
