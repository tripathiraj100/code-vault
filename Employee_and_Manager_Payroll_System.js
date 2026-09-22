class Employee{
    constructor(id,name,basicsalary){
        this.id = id;
        this.name = name;
        this.basicsalary = basicsalary;
    }
    calculatesalary() {
        return this.basicsalary;
    }
}
class Manager extends Employee {
    constructor(id,name,basicsalary,incentive){
        super(id,name,basicsalary);
        this.incentive = incentive;
    }
    calculatesalary () {
        return this.basicsalary + this.incentive;
    }
}
let s1 = new Employee(1,"Raj",90000);
let s2 = new Manager(2,"Saanu",100000,20000);

console.log(s1.calculatesalary());
console.log(s2.calculatesalary());
