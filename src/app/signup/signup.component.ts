import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api-service';
import { SignupDto } from '../dto/signup-dto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router, private toaster: ToastrService) { }
  signupDto: SignupDto = new SignupDto();
  formSubmit: boolean = false;
  ngOnInit(): void {

  }


  onSubmitForm(form: any) {
    this.formSubmit = true;
    if (this.signupDto && this.signupDto.firstName && this.signupDto.lastName && this.signupDto.email
      && this.signupDto.password && this.signupDto.confirmPassword) {
      if (this.signupDto.password != this.signupDto.confirmPassword) {
        return;
      }
      this.apiService.postService(this.apiService.apiUrls.signup, this.signupDto).subscribe((response: any) => {
        if (response && response.statusCode == 200) {
          this.toaster.success(response.message,"Success");
          this.loginPage();
        } else {
          this.toaster.error(response.message,"Error");
        }
      });
    }else{
      this.toaster.warning("Please Enter Mandatory fields","Warning!");
    }
  }
  loginPage() {
    this.router.navigate(['/login']);
  }
}
