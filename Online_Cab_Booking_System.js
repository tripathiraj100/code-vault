class Vehicle{
    static platformName = "FastCab Bookings";
    constructor(vehicleNo, driverName,distance){
        this.vehicleNo = vehicleNo;
        this.driverName = driverName;
        this.distance = distance;
    }
    static displayplatformname(){
        console.log(`Welcome to ${platformName}`);
    }
    calculateFare(){
        return 0;
    }
}
class Car extends Vehicle{
    constructor(vehicleNo, driverName,distance){
        super(vehicleNo, driverName,distance);
    }
    calculateFare(){
        const priceperkm = 15;
        return this.distance * priceperkm;
    }
}
class Bike extends Vehicle{
    constructor(vehicleNo, driverName,distance){
        super(vehicleNo, driverName,distance);
    }
    calculateFare(){
        const priceperkm = 8;
        return this.distance * priceperkm;
    }
}
let myCar = new Car("DL-01-AB-1234", "Ramesh Kumar", 20);
let mybike = new Bike("DL-01-5678","Rammy Rawat",20);

console.log(myCar.calculateFare());
console.log(mybike.calculateFare());