import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {User} from "./user";
import {File} from "./file";

@Entity()
export class MemberOrg {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.id, {
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user!: Relation<User>

    @ManyToMany(() => File, (file) => file.id, {
        cascade: false,
        nullable: true,
    })
    @JoinColumn()
    file!: Relation<File>;

    @Column({
        comment: "Кем является в организации",
    })
    memberRole!: string
}