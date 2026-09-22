class Person {
    constructor(id, name, age){
        this.id = id;
        this.name = name;
        this.age = age;
    }
    displayDetails() {
        console.log(`ID: ${this.id} | Name: ${this.name} | Age: ${this.age}`);
    }
}
class Doctor extends Person{
    constructor(id, name, age,specialization,consultationFee){
        super(id, name, age);
        this.specialization = specialization;
        this.consultationFee = consultationFee;
    }
    displayDetails() {
        console.log(`[Doctor] ID: ${this.id} | Name: Dr. ${this.name} | Age: ${this.age} | Specialization: ${this.specialization} | Fee: $${this.consultationFee}`);
    }
}
class Patient extends Person{
    constructor(id, name, age,disease,roomNo){
        super(id, name, age);
        this.disease = disease;
        this.roomNo=roomNo;
    }
    displayDetails() {
        console.log(`[Patient] ID: ${this.id} | Name: ${this.name} | Age: ${this.age} | Disease: ${this.disease} | Room No: ${this.roomNo}`);
    }
}
let doc1 = new Doctor(101, "Aakash Mehta", 45, "Cardiologist", 1500);
let pat1 = new Patient(201, "Rohan Verma", 28, "Viral Fever", "Room 304");

console.log(doc1.displayDetails());
console.log(pat1.displayDetails());