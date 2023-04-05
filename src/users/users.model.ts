import { Column, DataType, Table, Model, BelongsToMany, HasOne } from "sequelize-typescript";
import { Profile } from "src/profile/profile.model";
import { Role } from "src/roles/roles.model";
import { UserRole } from "src/roles/user-role.model";
import { Token } from "src/token/token.model";

interface UserCreationAttr {
    email: string,
    password: string
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    // связь many-to-many (от текущей табл. Role к User используя промежуточную таблицу UserRole)
    @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];

    @HasOne(() => Token)
    token: Token

    @HasOne(() => Profile)
    profile: Profile
}