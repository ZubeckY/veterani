import {Column,Relation, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        comment: "Должность",
        nullable: false,
    })
    post!: string;

    @Column({
        comment: "Текст",
        nullable: true,
    })
    text!: string;

    @OneToOne(() => User, (user: any) => user.id, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user!: Relation<User>;
}