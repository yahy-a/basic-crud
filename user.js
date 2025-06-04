class User {
    constructor(name, age, place) {
        this.id = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        this.name = name;
        this.age = age;
        this.place = place;
    }
}

export { User };
