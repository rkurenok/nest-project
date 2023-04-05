export class CreateProfileDto {
    readonly name: string;
    readonly surname: string;
    readonly patronymic: string;
    readonly phone: string;
    readonly userId: number;

    constructor(model) {
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.phone = model.phone;
        this.userId = model.userId;
    }
}