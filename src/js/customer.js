//Customer klass så att alla info om kunden sparas på vettigt sett
export default class Customer {
    constructor(name, email, phone, address, zip, county){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.zip = zip;
        this.county = county;
    }
}