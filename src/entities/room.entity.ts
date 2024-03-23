import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata";

@Entity("room")
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("timestamp", { default: new Date() })
  created_at!: Date;

  @Column("jsonb", { default: [] })
  users!: {
    id: string;
    username: string;
    isOnline: boolean;
  }[];

  @Column("jsonb", { default: [] })
  chats!: { message: string; created_at: Date; userId: string }[];

  @Column("text", { default: "" })
  concept!: string;

  @Column("jsonb", { default: [] })
  questions!: string[];

  @Column("int", { default: -1 })
  currentQuestion!: number;
}
