import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  miForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),

  });
  logued: boolean
  errorMessage : string

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService
    ) {
    this.logued = false;
    this.errorMessage = ''
  }

  ngOnInit(): void {
    this.afAuth.user.subscribe(
      (user) => {
        if (user) {
          this.logued = true
        }
      }
    )
  }

  get controlsForm() {
    return this.miForm.controls
  }

  createUser() {
    if (!this.miForm.invalid) {
      this.spinner.show()
      this.afAuth.createUserWithEmailAndPassword(this.miForm.value.user, this.miForm.value.password).then(
        () => {
          console.log('registrado')
          this.router.navigate(['']);
          this.spinner.hide()

        }
      ).catch(
        (resp) => {
          console.log(resp.message)
          this.spinner.hide()
          this.errorMessage = resp.message
        }
      );
    }else{
      alert('Error en los datos')
    }
  }

  signIn() {
    if (!this.miForm.invalid) {
      this.spinner.show()
      this.afAuth.signInWithEmailAndPassword(this.miForm.value.user, this.miForm.value.password).then(
        () => {
          this.router.navigate(['']);
          this.spinner.hide()
        }
      ).catch(
        (resp) => {
          console.log(resp.message)
          this.spinner.hide()
          this.errorMessage = resp.message
        }
      );
    } else {
      alert('Error en los datos')
    }
  }

  logout() {
    this.afAuth.signOut()
    this.logued = false
  }


}
