import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Verification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length : 150 })
    email: string;

    @Column({ type: 'int' })
    code: number;

    @Column({ type: 'int' })
    resendCount: number;

    @Column({ type: 'int' })
    isValid: number;

    @Column({ type: 'varchar', length: 20 })
    type: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}