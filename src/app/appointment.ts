export class Appointment{

    constructor(){
        this.treatment = "";
        this.drug = "";
        this.regularCost = 0;
        this.discount = 0;
        this.realCost = 0;
    }

    treatment: String;
    drug: String;
    regularCost: number;
    discount: number;
    realCost: number;
}