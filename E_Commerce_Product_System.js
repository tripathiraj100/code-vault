class Product{
    constructor(productId, productName,price){
        this.productId = productId;
        this.productName = productName;
        this.price = price;
    }
    getDiscountedPrice(discount) {
        return this.price - discount;
    }
    static compareProducts(p1,p2){
        if(p1.price > p2.price){
            console.log(`"${p1.productName}" is more expensive ($${p1.price} vs $${p2.price}).`);
        }else if(p2.price > p1.price){
            console.log(`"${p2.productName}" is more expensive ($${p2.price} vs $${p1.price}).`);
        }else{
            console.log(`Both products have the same price ($${p1.price}).`);
        }
    }
    displayDetails() {
        console.log(`[Product] ID: ${this.productId} | Name: ${this.productName} | Price: $${this.price}`);
    }
}
class Electronics extends Product{
    constructor(productId, productName,price,warranty){
        super(productId, productName,price);
        this.warranty = warranty;
    }
    displayDetails() {
        console.log(`[Electronics] ID: ${this.productId} | Name: ${this.productName} | Price: $${this.price} | Warranty: ${this.warranty}`);
    }
}
const p1 = new Product(101, "Office Desk", 15000);
const e1 = new Electronics(201, "Sony 4K Smart TV", 65000, "3 Years On-Site");
console.log(p1.displayDetails());
console.log(e1.displayDetails());
console.log(p1.getDiscountedPrice(5000));
console.log(Product.compareProducts(p1, e1));