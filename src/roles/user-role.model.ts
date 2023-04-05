import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Role } from "./roles.model";

@Table({ tableName: 'user_role', createdAt: false, updatedAt: false }) // убираем createdAt и updatedAt
export class UserRole extends Model<UserRole> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => User) // внешний ключ и на что ссылается
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => Role) // внешний ключ и на что ссылается
    @Column({ type: DataType.INTEGER })
    roleId: number;
}