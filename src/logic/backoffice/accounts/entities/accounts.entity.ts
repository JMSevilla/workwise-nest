import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as bcrypt from 'bcrypt';

@Entity()
export class Accounts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    firstname: string;

    @Column({ type: 'varchar', length: '50' })
    middlename: string;

    @Column({ type: 'varchar', length: 100 })
    lastname: string;

    @Column({ type: 'varchar' , length: 15 })
    username: string;

    @Column({ type: 'varchar', length: 150 })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    @Column({ type: 'varchar', length: 500 })
    imgurl: string;

    @Column({ type: 'int' })
    status: number;

    @Column({ type: 'int' })
    verified: number;

    @Column({ type: 'enum', enum: ['admin', 'moderator', 'user']})
    access_level: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}