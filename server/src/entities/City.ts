import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "cities" })
export class City {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;
}
