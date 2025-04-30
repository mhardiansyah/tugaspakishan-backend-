import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from './auth.userRole.entity';
import { Role } from './auth.roles.entity';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  verification_token_expiry: Date;

  @Column({ type: 'timestamp', nullable: true })
  token_expires_at: Date;

  @Column({ nullable: true, length: 512 })
  access_token: string;

  @Column({ nullable: true, length: 512 })
  refresh_token: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' }) // mapping ke kolom role_id
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
