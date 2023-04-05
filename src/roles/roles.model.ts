import { Column, DataType, Table, Model, BelongsToMany } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserRole } from "./user-role.model";

interface RoleCreationAttr {
    value: string,
    description: string
}

@Table({ tableName: 'role' })
export class Role extends Model<Role, RoleCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    // связь many-to-many (от текущей табл. Role к User используя промежуточную таблицу UserRole)
    @BelongsToMany(() => User, () => UserRole)
    users: User[];
}