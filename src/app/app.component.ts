import { Component ,NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-firestore';
  public _opened: boolean = false;
  logued: boolean

  constructor(private afAuth: AngularFireAuth,private router: Router,
    private ngZone: NgZone) {
    this.logued = false;
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

  logout() {
    this.afAuth.signOut()
    this.logued = false
    this.router.navigate(['/login']);
  }

  signIn(){
    this.router.navigate(['/login']);
  }

  public _toggleSidebar() {
    this._opened = !this._opened;
  }
}
