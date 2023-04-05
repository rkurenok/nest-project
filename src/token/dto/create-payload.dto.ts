import { Role } from "src/roles/roles.model";

export class CreatePayloadDto {
    readonly id: number;
    readonly email: string;
    readonly roles: Role[];

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.roles = model.roles;
    }
}