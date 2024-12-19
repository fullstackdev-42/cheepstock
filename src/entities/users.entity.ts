import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    public user_id: number;

    @Column({ length: 255, nullable: true })
    public user_email: string;

    @Column({ length: 255, nullable: true })
    public password: string;

    @Column({ length: 100, nullable: true })
    public user_name: string;

    @Column({ nullable: true })
    public status: number;

    @Column({ nullable: true })
    public tsv_enable: number;

    @Column({ length: 16, nullable: true })
    public tsv_secret: string;

    @Column({ nullable: true })
    public user_type: number;
    
    @Column({ type: "timestamp", precision: 6, nullable: true })
    public last_login_tstamp:Date;

    @Column({ type: "timestamp", precision: 6, nullable: true })
    public created_time_tstamp:Date;

    @Column({ length: 39, nullable: true })
    public last_login_ip: string;

    @Column({ type: "timestamp", precision: 6, nullable: true })
    public reset_password_tstamp:Date;

    @Column({ type: "timestamp", precision: 6, nullable: true })
    public invite_time:Date;

    @Column({ length: 16, nullable: true })
    public invite_token: string;
}