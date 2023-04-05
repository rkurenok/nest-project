import { Column, DataType, Table, Model } from "sequelize-typescript";

interface TextBlockCreationAttr {
    name: string,
    title: string,
    text: string,
    group: string
}

@Table({ tableName: 'text-block' })
export class TextBlock extends Model<TextBlock, TextBlockCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    text: string;

    @Column({ type: DataType.STRING, allowNull: false })
    group: string;
}