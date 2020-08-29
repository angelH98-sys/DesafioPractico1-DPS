import { Appointment } from './appointment';

export class Customer{

    constructor(){
        this.name = "";
        this.dui = "";
        this.petName = "";
        this.appointments = [];
    }

    name: String;
    dui: String;
    petName: String;
    appointments: Appointment[];
}