import {
    Column,
    Relation,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
    ManyToMany
} from "typeorm";
import {User, File} from "./";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        comment: "Заголовок",
        length: 150,
        nullable: false,
    })
    headLine!: string;

    @Column({
        comment: "Текст",
        nullable: false,
    })
    text!: string;

    @Column({
        comment: "Состоит в слайдере",
        nullable: false,
        default: false,
    })
    includesSlider!: boolean;

    @ManyToOne(() => User, (user) => user.id, {
        cascade: false,
        nullable: false,
    })
    @JoinColumn()
    user!: Relation<User>;

    @ManyToMany(() => File, (file) => file.id, {
        cascade: false,
        nullable: true,
    })
    @JoinTable()
    file!: Relation<File>[];

    @Column({
        comment: "Ссылка на пост",
        unique: true,
        nullable: false,
    })
    link!: string;

    @Column({
        comment: "Публикация",
        default: false,
    })
    published!: boolean;

    @Column({
        comment: "Предложенный",
        default: false,
    })
    suggested!: boolean;

    @CreateDateColumn({
        comment: "Дата создания"
    })
    created!: Date;
}