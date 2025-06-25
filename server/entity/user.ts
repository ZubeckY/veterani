import {
    Relation,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn, JoinTable
} from "typeorm";
import {Role} from "../types/role";
import {File} from "./file";
import {OrgRole} from "../types/orgRole";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    /** ФИО */
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

    /** EMAIL */
    @Column({
        comment: "Почта",
        length: 255,
        nullable: false,
        unique: true,
    })
    email!: string;

    /** Дополнительная информация */
    @Column({
        comment: "Роль",
        enum: Role,
        default: Role.guest,
        type: "enum"
    })
    role?: Role;

    @Column({
        comment: "Роль в организации",
        enum: OrgRole,
        default: OrgRole.user,
        type: "enum"
    })
    memberRole?: OrgRole;

    @Column({
        nullable: true,
        comment: "Кем является в организации",
    })
    memberRoleTitle?: string;

    /** Файл */
    @ManyToMany(() => File, (file) => file.id, {
        cascade: false,
        nullable: true,
    })
    @JoinColumn()
    file!: Relation<File>;

    /** Системная информация */
    @Column({
        comment: "Пароль",
        nullable: false,
    })
    password!: string;

    @Column({
        comment: "Активация",
        default: false
    })
    activated?: boolean;

    @Column({
        comment: "Код активации"
    })
    activatedCode!: string;

    @Column({
        comment: "Заблокирован",
        default: false,
    })
    block?: boolean;

    @CreateDateColumn({
        comment: "Дата создания",
    })
    created!: Date;

    @UpdateDateColumn({
        comment: "Дата редактирования"
    })
    updated!: Date;

}