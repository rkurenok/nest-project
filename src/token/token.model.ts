import { Column, DataType, Table, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface TokenCreationAttr {
    refreshToken: string,
    userId: number
}

@Table({ tableName: 'token' })
export class Token extends Model<Token, TokenCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING(1000), unique: true, allowNull: false }) // увеличиваем длину стандартной строки в бд (255 -> 1000)
    refreshToken: string;

    @ForeignKey(() => User) // внешний ключ
    @Column({ type: DataType.INTEGER })
    userId: number

    @BelongsTo(() => User)
    user: User
}