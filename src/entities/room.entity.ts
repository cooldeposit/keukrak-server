import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata";
import { randomNickname } from "../utils/randomNickname";

interface NicknameType {
  icon: string;
  name: string;
  color: string;
}

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
    isAdmin: boolean;

    nickname: NicknameType;
  }[];

  @Column("jsonb", { default: [] })
  chats!: {
    message: string;
    created_at: Date;
    userId: string;
    nickname: NicknameType;
  }[];

  @Column("text", { default: "" })
  concept!: string;

  @Column("jsonb", { default: [] })
  questions!: string[];

  @Column("int", { default: -1 })
  currentQuestion!: number;

  @Column("text", { default: randomNickname() })
  aiNickname!: NicknameType;
}
