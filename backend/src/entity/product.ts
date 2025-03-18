import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number; // Definite assignment assertion

  @Column()
  sku!: string; // Definite assignment assertion

  @Column()
  name!: string; // Definite assignment assertion

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number; // Definite assignment assertion

  @Column("text", { array: true })
  images!: string[]; // Definite assignment assertion
}