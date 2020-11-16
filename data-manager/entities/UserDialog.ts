import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class UserDialog {
    @PrimaryGeneratedColumn({ unsigned: true, type: "bigint" })
    id: number;

    @Index()
    @Column("int", {unsigned: true})
    cardCode: number;

    @Column("text")
    text: string;

    @ManyToOne(() => User, user => user.dialogues)
    user: User;


}
