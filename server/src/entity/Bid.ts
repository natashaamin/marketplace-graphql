import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity("bids")
export class Bid extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true })
    quantity: number;

    @Column('int', { nullable: true })
    price: number;

    @Column('varchar')
    status: string;

    @Column("timestamp", { nullable: true })
    startTime: Date;

    @Column("timestamp", { nullable: true })
    endTime: Date;
}