import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { ApiService } from '../service/api.service';
import { SharedComponent } from '../shared/conformModal.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employeeList: any[] = [];
  employeeForm: any;
  isDeleting: boolean = false;
  isDeactivated:boolean= false
  editMode: boolean = false; 

  constructor(private modalService: NgbModal, private apiService: ApiService) {}
  // Fetch employee data when the component initializes
  ngOnInit(): void {
    this.fetchData();
    
  }

  // Open the modal to add or update an employee
  openModal(id?: any) {
    const openModal = this.modalService.open(ModalComponent);
    // Set the id and employeeList property of the modal componentInstance
    openModal.componentInstance.id = id;
    openModal.componentInstance.employeeList = this.employeeList;
    // Find the employee with the given id from the employeeList
    let currentEmployee = this.employeeList.find((e: any) => e.id === id);
    console.log(currentEmployee);
    // If currentEmployee is found then assign to the currentEmployee property of the modalcomponent
    if (currentEmployee) {
      openModal.componentInstance.currentEmployee = currentEmployee;
    }
  }
  fetchData() {
    this.apiService.GetEmployee().subscribe(
      (response: any) => { 
        if (response.employees) {
          // Map the received employee data and set the 'active' property
          this.employeeList = response.employees.map((employeelist: any) => ({ ...employeelist}));
          // Load stored employee data from localStorage
          const storedEmployeeData = localStorage.getItem('');
          if (storedEmployeeData) {
            const storedData = JSON.parse(storedEmployeeData); 
            // Merge stored data with fetched data using a map
            this.employeeList = this.employeeList.map((employee: any) => {
              const storedEmployee = storedData.find((e: any) => e.id === employee.id);
              return storedEmployee ? { ...employee, ...storedEmployee } : employee;
            });
          } 
          // Store the updated employeeList in local storage
          localStorage.setItem('employeeData', JSON.stringify(this.employeeList));
        }
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
    }
    DeactivateEmployee(employee: any) {
      const deleteModal = this.modalService.open(SharedComponent);
      deleteModal.componentInstance.actionMessage = 'deactivate';
      deleteModal.componentInstance.employee = employee.name;
      deleteModal.result.then((result) => {
        if (result === true) {
          this.apiService.deactivateEmployee(employee.id).subscribe(
            (response: any) => {
              console.log('Employee deactivated:', response);
              // Update the employee  only after a successful deactivation
              employee.active = false;
            },
            (error: any) => {
              console.error('Error deactivating employee:', error);
            }
          );
        }
      });
    }
    getYesNo(value: boolean): string {
      return value ? 'Yes' : 'No';
    }
  clearForm(): void {
    this.employeeForm.reset();
  }
  
  formatDate(date: NgbDateStruct): string {
    const year = date.year;
    const month = date.month < 10 ? '0' + date.month : date.month;
    const day = date.day < 10 ? '0' + date.day : date.day;
    return `${year}-${month}-${day}`;
  }
}
