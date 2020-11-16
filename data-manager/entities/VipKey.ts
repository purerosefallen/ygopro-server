import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class VipKey {
    @PrimaryGeneratedColumn({unsigned: true, type: "bigint"})
    id: number;

    @Index({unique: true})
    @Column("varchar", {length: 30})
    key: string;

    @Column("int", {unsigned: true})
    type: number;

    @Index()
    @Column("tinyint", {unsigned: true, default: 0})
    isUsed: number;

    @ManyToOne(() => User, user => user.usedKeys)
    usedBy: User;

    toJSON() {
        return {key: this.key, type: this.type};
    }
}
