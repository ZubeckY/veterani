import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import * as uuid from 'uuid'

@Entity()
export class MemberOrg {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        comment: 'Любое uuid значение',
        default: uuid.v4()
    })
    value?: string
}
