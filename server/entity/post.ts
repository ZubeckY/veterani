import {Column, Relation, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

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

    @CreateDateColumn({
        comment: "Дата создания"
    })
    created!: Date;
}