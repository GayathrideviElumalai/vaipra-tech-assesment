import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'assessment';
  displayedColumns: string[] = ['title', 'image', 'collabrator', 'privacy'];
  dataSource = new MatTableDataSource();
  listData: any = [
  ]
  customerData: any = [];
  customerForm!: FormGroup;
  regions = [
    { value: 'north', viewValue: 'North' },
    { value: 'south', viewValue: 'South' },
    { value: 'east', viewValue: 'East' },
    { value: 'west', viewValue: 'West' }
  ];
  countries = [
    { value: 'usa', viewValue: 'USA' },
    { value: 'canada', viewValue: 'Canada' },
    { value: 'exico', viewValue: 'Mexico' }
  ];
  form!: FormGroup;
  collaborators: any = [];
  @ViewChild('customer') customer!: TemplateRef<any>;
  @ViewChild('pin') pin!: TemplateRef<any>;
  selImg: any;
  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.dataSource.data = this.listData;
    console.log(this.dataSource.data)
    this.customerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      region: new FormControl('', Validators.required),
      country: new FormControl()
    });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      collaborator: new FormControl('', Validators.required),
      privacy: new FormControl('private')
    });
  }
  get isValid() {
    return this.customerForm.get('name')?.valid &&
      this.customerForm.get('email')?.valid &&
      this.customerForm.get('region')?.valid;
  }
  sanitizedImageUrl: any;

  getImageUrl(imagePath: string): void {
    const file = new File([imagePath], imagePath);
    const url = URL.createObjectURL(file);
    this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }
  handleFileInput(event: any) {
    const input = event.target;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.selImg = e.target?.result;
        this.form.value.image = this.selImg;
      };

      reader.readAsDataURL(file);
    }
  }
  onSubmit(formValue: any): void {

    this.customerData.push(formValue);
    console.log('customerData', this.customerData);
    this.collaborators.push(formValue);
    this.customerForm.reset();
    this.dialog.closeAll();
    // Save the form data to your database or API
  }
  onSubmitPin() {
    console.log('Form Value', this.form.value);
    this.dialog.closeAll();
    this.listData.push(this.form.value);
    this.dataSource.data = [...this.listData]
    this.cd.detectChanges();
    console.log(this.dataSource.data)
    this.form.reset();

  }
  addcustomer() {
    this.customerForm.reset();
    this.dialog.open(this.customer, { disableClose: true });
  }
  cancel() {
    this.customerForm.reset();
    this.dialog.closeAll();
  }
  addpin() {
    this.form.reset();
    this.form.value.privacy = 'private';
    this.form.controls['privacy'].setValue('private');
    this.dialog.open(this.pin, { disableClose: true });

  }
}
