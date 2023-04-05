export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly name: string;
    readonly surname: string;
    readonly patronymic: string;
    readonly phone: string;
    readonly userId: number;
}