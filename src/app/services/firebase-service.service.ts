import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(private firestore: AngularFirestore) { }

  getUsers(){
    return this.firestore.collection("users").snapshotChanges();
  }

  createUser(user:any){
    return this.firestore.collection("users").add(user);
  }

  updateUser(id:any, user:any){
    return this.firestore.collection("users").doc(id).update(user);
  }

  deleteUser(id:any){
    return this.firestore.collection("users").doc(id).delete();
  }

  getProducts(){
    return this.firestore.collection("products").snapshotChanges();
  }

  createProduct(product:any){
    return this.firestore.collection("products").add(product);
  }

  updateProduct(id:any, product:any){
    return this.firestore.collection("products").doc(id).update(product);
  }

  deleteProduct(id:any){
    return this.firestore.collection("products").doc(id).delete();

  }

}
