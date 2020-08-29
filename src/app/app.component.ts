import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from '../app/customer';
import { Appointment } from './appointment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  customerForm: FormGroup;
  appointmentForm: FormGroup;
  customerList: Customer[] = [];
  customerIndex: number;

  //Variables de navegabilidad
  inCustomerForm: Boolean = false;
  inCustomerTable: Boolean = false;
  inAppointmentForm: Boolean = false;
  inAppointmentTable: Boolean = false;

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(){

    //Asignamos al formulario de Clientes por defecto
    this.inCustomerForm = true;

    /**
     * Asignamos los campos de los formularios
     */

    this.customerForm = this.formBuilder.group({
      name: ["", Validators.required],
      dui: ["", [Validators.required, Validators.pattern(/^[0-9]{8}-[0-9]$/)]],
      petName: ["", Validators.required]
    });
    this.appointmentForm = this.formBuilder.group({
      treatment: ["", Validators.required],
      drug: ["", Validators.required],
      cost:[0.00, [Validators.required, Validators.pattern(/^\$?\d+(,\d{3})*(\.\d*)?$/)]]
    });
  }

  addAppointment(){
    
    //Obtenemos el control que almacena el tratamiento de la consulta
    let treatmentControl: FormControl = this.appointmentForm.get('treatment') as FormControl;
    if(treatmentControl.invalid){
      /**
       * El status del control será inválido únicamente
       * si el control permanece vacío.
       */
      alert("Tratamiento requerido");
      return;
    }

    //Obtenemos el control que almacena el medicamento de la consulta
    let drugControl: FormControl = this.appointmentForm.get('drug') as FormControl;
    if(treatmentControl.invalid){
      /**
       * El status del control será inválido únicamente
       * si el control permanece vacío.
       */
      alert("Medicamento requerido");
      return;
    }

    //Obtenemos el control que almacena el costo de la consulta
    let costControl: FormControl = this.appointmentForm.get('cost') as FormControl;
    if(costControl.invalid){
      /**
       * El status del control será inválido en dos escenarios:
       * 1. El control se recibió vacío.
       * 2. El control no cumple con la expresión regular establecida.
       */
      alert("Costo inválido");
      return;
    }

    let appointment: Appointment = new Appointment();
    appointment.treatment = treatmentControl.value;
    appointment.drug = drugControl.value;
    appointment.regularCost = costControl.value;

    let customer: Customer = this.customerList[this.customerIndex]; 
    let discountPercentage: number = 0;
    if(customer.appointments.length >= 2) discountPercentage = 0.05;
    if(customer.appointments.length >= 4) discountPercentage = 0.1;

    appointment.discount = appointment.regularCost * discountPercentage;
    appointment.realCost = appointment.regularCost - appointment.discount;

    customer.appointments.push(appointment);

    this.toAppointmentTable(this.customerIndex);
  }

  addCustomer(){

    //Obtenemos el control que almacena el nombre del cliente
    let nameControl: FormControl = this.customerForm.get('name') as FormControl;
    if(nameControl.invalid){
      /**
       * El status del control será inválido únicamente
       * si el control permanece vacío.
       */
      alert('Nombre requerido');
      return;
    }
    if(this.alreadyExist(nameControl.value, "")){
      alert('Ya existe un cliente registrado con ese nombre');
      return;
    }
    
    //Obtenemos el control que almacena el DUI del cliente
    let duiControl: FormControl = this.customerForm.get('dui') as FormControl;
    if(duiControl.invalid){
      /**
       * El status del control será inválido en dos escenarios:
       * 1. El control se recibió vacío.
       * 2. El DUI no cumple con la expresión regular establecida.
       */
      alert('DUI inválido');
      return;
    }
    if(this.alreadyExist("", duiControl.value)){
      alert('Ya existe un cliente registrado con ese DUI');
      return;
    }

    //Obtenemos el control que almacena el nombre de la mascota del cliente
    let petNameControl: FormControl = this.customerForm.get('petName') as FormControl;
    if(petNameControl.invalid){
      /**
       * El status del control será inválido únicamente
       * si el control permanece vacío.
       */
      alert('Nombre de mascota requerido');
      return;
    }

    let customer: Customer = new Customer();
    customer.name = nameControl.value;
    customer.dui = duiControl.value;
    customer.petName = petNameControl.value;

    this.customerList.push(customer);
    this.toCustomerTable();
  }

  alreadyExist(name: String, dui: String){

    /**
     * Método que verifica si el nombre o el
     * DUI del cliente a registrar sigue disponible.
     */
    let invalid = false;
    this.customerList.forEach(element => {
      if(name != "" && element.name == name){
        invalid = true;
        return;
      }
      if(dui != "" && element.dui == dui){
        invalid = true;
        return;
      }
    });
    return invalid;
  }

  //Métodos de naegabilidad

  resetNavegability(){
    this.inCustomerForm = false;
    this.inCustomerTable = false;
    this.inAppointmentForm = false;
    this.inAppointmentTable = false;
  }

  toCustomerTable(){
    if(this.customerList.length == 0){
      alert("No existen registros");
      return;
    }
    this.resetNavegability();
    this.inCustomerTable = true;
  }

  toCustomerForm(){
    this.resetNavegability();
    this.customerForm.reset();
    this.inCustomerForm = true;
  }

  toAppointmentForm(index: number){
    this.resetNavegability();
    this.customerIndex = index;
    this.appointmentForm.reset();
    this.inAppointmentForm = true;
  }

  toAppointmentTable(index: number){
    this.customerIndex = index;
    if(this.customerList.length == 0 || 
        this.customerList[index].appointments.length == 0){
      alert("No existen registros");
      return;
    }
    this.resetNavegability();
    this.inAppointmentTable = true;
  }
}
