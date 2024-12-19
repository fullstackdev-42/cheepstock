import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public role_name: string;

    @Column({ nullable: true })
    public slug_name: string;
}