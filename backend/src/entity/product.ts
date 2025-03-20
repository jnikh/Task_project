import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column()
  sku!: string; 

  @Column()
  name!: string; 

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number; 

  @Column("text", { array: true })
  images!: string[]; 
}