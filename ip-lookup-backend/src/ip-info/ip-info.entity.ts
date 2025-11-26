import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('ip_info')
@Unique(['ip_address'])
export class IpInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'ip_address', type: 'varchar', length: 45})
  ip_address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  isp: string;

  @Column({ nullable: true , type: 'double precision'})
  latitude: number;

  @Column({ nullable: true , type: 'double precision'})
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
