import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
interface votingModel {
    userId: number;
    result: boolean;
}

@Entity()
export class Voting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({comment: 'Тема голосования'})
    theme!: string;

    @Column({
        comment: "Голосующие и голоса",
        nullable: true,
        default: { }
    })
    votingResult!: votingModel[];

    @Column({
        comment: 'Голосование закрыто',
        default: false
    })
    isClosed!: boolean;

    @CreateDateColumn({
        comment: "Дата создания",
    })
    created!: Date;
}