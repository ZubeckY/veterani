import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Role} from "../types/role";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        comment: "Имя",
        length: 50,
        nullable: false,
    })
    firstName!: string;

    @Column({
        comment: "Фамилия",
        length: 50,
        nullable: false,
    })
    lastName!: string;

    @Column({
        comment: "Отчество",
        length: 50,
    })
    middleName!: string;

    @Column({
        comment: "Почта",
        length: 255,
        nullable: false,
        unique: true,
    })
    email!: string;

    @Column({
        comment: "Пароль",
        nullable: false,
    })
    password!: string;

    @Column({
        comment: "Роль",
        enum: Role,
        default: Role.guest,
        type: "enum"
    })
    role?: Role;

    @CreateDateColumn({
        comment: "Дата создания",
    })
    created!: Date;

    @UpdateDateColumn({
        comment: "Дата редактирования"
    })
    updated!: Date;

    @Column({
        comment: "Заблокирован",
        default: false,
    })
    block?: boolean;
}