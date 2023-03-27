//Product klass så att alla info om produkten sparas på vettigt sett
export default class Product {
    constructor(id, title, price, category, description, imageURL, quantity){
        this.id = id;
        this.title = title;
        this.price = price;
        this.category = category;
        this.description = description;
        this.imageURL = imageURL;
        this.quantity = quantity;
    }
}