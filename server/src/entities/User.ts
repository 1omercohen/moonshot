import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { City } from "./City";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "firstName" })
    firstName!: string;

    @Column({ name: "lastName" })
    lastName!: string;

    @Column({ name: "birthDate", type: "timestamp" })
    birthDate!: Date;

    @ManyToOne(() => City, { eager: true })
    @JoinColumn({ name: "cityId" })
    city!: City;

    @CreateDateColumn({
        name: "createdAt",
        type: "timestamp",
        default: new Date(),
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updatedAt",
        type: "timestamp",
        default: new Date(),
    })
    updatedAt!: Date;
}
