import {Column, Relation, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false, unique: true, comment: 'Значение' })
    value!: string

    @ManyToOne(() => User, (user) => user.id, {
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user!: Relation<User>

    @CreateDateColumn({ comment: 'Дата создания' })
    created!: Date
}