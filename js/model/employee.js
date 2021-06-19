class Employee {
    constructor(id, name, position, salary, hours) {
        this.id = Number(id);
        this.name = name;
        this.position = position;
        this.salary = Number(salary);
        this.hours = Number(hours);
    }

    calculateTotalSalary() {
        let totalSalary = this.salary;
        if(this.position === 'Quản lý') {
            totalSalary *= 2;
        } else if(this.position === 'Giám đốc') {
            totalSalary *= 3;
        }
        return totalSalary;
    }

    ranking() {
        let rank = 'Nhân viên trung bình';
        if(this.hours >= 120) {
            rank = 'Nhân viên xuất sắc';
        } else if(this.hours >= 100) {
            rank = 'Nhân viên giỏi';
        } else if(this.hours >= 80) {
            rank = 'Nhân viên khá';
        }
        return rank;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
    }

    getSalary() {
        return this.salary;
    }

    setSalary(salary) {
        this.salary = salary;
    }

    getHours() {
        return this.hours;
    }

    setHours(hours) {
        this.hours = hours;
    }

    
}