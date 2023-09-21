import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { SharedComponent } from 'src/app/shared/conformModal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() id: any;
  employeeForm!: FormGroup;
  @Input() currentEmployee: any;
  editMode = true;
  isDisabled: boolean = false;
  employeeList: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    // Create form controls with validation
  }
  ngOnInit(): void {
    this.editMode = !!this.id; // Set editMode based on id
    this.employeeForm = this.fb.group({
      id: [this.currentEmployee?.id],
      name: [
        this.currentEmployee ? this.currentEmployee.name : '',
        Validators.required,
      ],
      age: [
        this.currentEmployee ? this.currentEmployee.age : '',
        Validators.required,
      ],
      dob: [
        this.currentEmployee ? this.currentEmployee.dob : '',
        Validators.required,
      ],
      email: [
        this.currentEmployee ? this.currentEmployee.email : '',
        [Validators.required, Validators.email],
      ],
      mob: [
        this.currentEmployee ? this.currentEmployee.mob : '',
        [Validators.required],
      ],
      gender: [
        this.currentEmployee ? this.currentEmployee.gender : '',
        Validators.required,
      ],
      department: [
        this.currentEmployee ? this.currentEmployee.department : '',
        Validators.required,
      ],
    });
  }

  submitForm(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      // Check if an existing employee is being updated
      if (this.id) {
        const updateModal = this.modalService.open(SharedComponent);
        // Set action message
        updateModal.componentInstance.actionMessage = 'update';
        updateModal.componentInstance.employee = '';
        updateModal.result.then((result) => {
          // If the user confirms the update
          if (result === true) {
            // API call to update the employee
            this.apiService
            .UpdateEmployee(this.id, formData)
            .subscribe((response: any) => {
              // Handle successful response
              const updatedEmployee = response.employee;
              console.log('API Response:', updatedEmployee);
              const index = this.employeeList.findIndex((employee: any) => {
                return employee.id === updatedEmployee.id;
              });
              if (index !== -1) {
                console.log('updated employee id:', updatedEmployee.id);
                const updatedList = [...this.employeeList];
                updatedList[index] = updatedEmployee;
                this.employeeList = updatedList; // Update the employeeList with the new data
                console.log('updatedlist', updatedList);
                this.activeModal.close(updatedEmployee);
              }
            });
          } else {
            console.log('Update canceled');
          }
        });  
      } else {
        // Otherwise, add a new employee
        // Call the AddEmployee
        this.apiService.addEmployee(formData).subscribe(
          (newEmployee: any) => {
            console.log('Employee added:', newEmployee);
            // Push the newEmployee into the employeeList[]
            this.employeeList.push(newEmployee);
            this.activeModal.close(newEmployee);
          },
          (error) => {
            console.error('Connection failed:', error);
            // alert("Connection Failed")
            // const modalRef = this.modalService.open(SharedComponent);
            // modalRef.componentInstance.login = true;
            // modalRef.componentInstance.actionMessage = 'Connection Failed';
          }
        );
      }
    } else {
      Object.values(this.employeeForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
  cancel() {
    this.activeModal.dismiss();
  }
}
