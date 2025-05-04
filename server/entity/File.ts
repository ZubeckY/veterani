import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        comment: "Название файла"
    })
    name!: string;

    @Column({
        nullable: false,
        comment: "Тип файла"
    })
    typeFile!: string;

    @Column({
        nullable: false,
        comment: "Путь к файлу"
    })
    path!: string;

    @Column({
        nullable: false,
        comment: "Выложен ли файл"
    })
    published!: boolean;

    @Column({
        nullable: false,
        comment: "Использование файла"
    })
    used!: boolean;

    @CreateDateColumn({
        comment: "Дата создания"
    })
    created!: Date;
}