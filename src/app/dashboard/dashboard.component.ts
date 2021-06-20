import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router:Router,private apiService:ApiService,private toaster:ToastrService) { }

  loggedInUser:any;
  enableDashboard:boolean=false;
  ngOnInit(): void {
    let loggedInUserString=localStorage.getItem("loggedInUser");    
    if(loggedInUserString){
      this.loggedInUser=JSON.parse(loggedInUserString);
      this.validateToken();
    }else{
      this.loginPage();
    }
  }
 loginPage() {
    this.router.navigate(['/login']);
  }
  logOut(){
    this.apiService.getService(this.apiService.apiUrls.logout).subscribe((response: any) => {
      if (response && response.statusCode == 200) {
        this.toaster.success(response.message,"Success");
        localStorage.removeItem("loggedInUser");
        this.loginPage();
      }else{
        this.toaster.error(response.message,"Error");
      }
    });
  }
  validateToken(){
    this.apiService.getService(this.apiService.apiUrls.validateSession).subscribe((response: any) => {
      if (response && response.statusCode == 200) {
        this.enableDashboard=true;
      }else{
        this.enableDashboard=false;
        localStorage.removeItem("loggedInUser");
        this.loginPage();
      }
    },(error)=>{
      this.enableDashboard=false;
      localStorage.removeItem("loggedInUser");
      this.loginPage();
    });
  }
}
