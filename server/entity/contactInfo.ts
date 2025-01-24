import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ContactInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        comment: "Телефон",
    })
    phone!: string;

    @Column({
        comment: "Почта"
    })
    email!: string;

    @Column({
        comment: "Адрес",
    })
    address!: string;

    @Column({
        comment: "Карта",
    })
    mapping!: string;
}