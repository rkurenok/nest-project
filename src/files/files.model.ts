import { Column, DataType, Table, Model } from "sequelize-typescript";

interface FilesCreationAttr {
    name: string,
    essenceTable: string,
    essenceId: number
}

@Table({ tableName: 'files' })
export class Files extends Model<Files, FilesCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING })
    essenceTable: string;

    @Column({ type: DataType.INTEGER })
    essenceId: number;
}