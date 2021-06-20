import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api-service';
import { LoginRequestDto } from '../dto/login-request-dto';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router,private toaster:ToastrService) { }
  loginDto: LoginRequestDto=new LoginRequestDto();
  loginFormSubmit: boolean = false;
  otpFormSubmit: boolean = false;
  otpFormEnabled: boolean = false;
  loginFormEnabled: boolean = true;
  ngOnInit(): void {

  }

  onSubmitForm(form: any) {
    this.loginFormSubmit = true;
    if (this.loginDto && this.loginDto.email && this.loginDto.password) {
      this.apiService.postService(this.apiService.apiUrls.login, this.loginDto).subscribe((response: any) => {
        if (response && response.statusCode == 200) {
          this.otpFormEnabled = true;
          this.loginFormEnabled = false;
        }else if(response && response.statusCode == 403){
          this.toaster.warning("Already having Active Sessions","Warning!");
          $('#warningSessionModal').modal({ backdrop: 'static', keyboard: false });
        }else{
          this.toaster.error(response.message,"Error");
        }
      }, (errorObject) => {
        localStorage.removeItem("loggedInUser")
        if(errorObject &&errorObject.error && errorObject.error.statusCode == 403){
          this.toaster.warning("Already having Active Sessions","Warning!");
          $('#warningSessionModal').modal({ backdrop: 'static', keyboard: false });
        }
      });
    }else{
      this.toaster.warning("Please Enter Mandatory fields","Warning!");
    }
  }
  onSubmitOTPForm(form: any) {
    this.otpFormSubmit = true;
    if (this.loginDto && this.loginDto.email && this.loginDto.otp) {
      this.apiService.postService(this.apiService.apiUrls.validateOtp, this.loginDto).subscribe((response: any) => {        
        if (response && response.statusCode == 200) {
          this.otpFormEnabled = false;
          this.loginFormEnabled = false;
          localStorage.setItem("loggedInUser",JSON.stringify(response.data));
          this.toaster.success(response.message,"Success");
          this.dashboardPage();
        }else{
          this.toaster.error(response.message,"Error");
        }
      }, (error) => {
        this.toaster.error(error?.message,"Error");
      });
    }else{
      this.toaster.warning("Please Enter Mandatory fields","Warning!");
    }
  }
 dashboardPage() {
    this.router.navigate(['/dashboard']);
  }
  closeAllSessions(){
    this.apiService.getService(this.apiService.apiUrls.forceLogout+this.loginDto.email).subscribe((response: any) => {
      if (response && response.statusCode == 200) {
        $('#warningSessionModal').modal('hide');
        this.toaster.success(response.message,"Success");
        localStorage.removeItem("loggedInUser");
      }else{
        this.toaster.error(response.message,"Error");
      }
    });
  }
}
