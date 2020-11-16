import {Column, Entity, Index, OneToMany, PrimaryColumn} from "typeorm";
import {UserDialog} from "./UserDialog";
import {VipKey} from "./VipKey";
import moment from "moment";

@Entity()
export class User {
    @PrimaryColumn({type: "varchar", length: 128})
    key: string;

    @Column("varchar", {length: 16, nullable: true})
    chatColor: string;

    @Index()
    @Column("datetime", {nullable: true})
    vipExpireDate: Date;

    isVip() {
        return this.vipExpireDate && moment().isBefore(this.vipExpireDate);
    }

    @Column("text", {nullable: true})
    victory: string;

    @Column("text", {nullable: true})
    words: string;

    @OneToMany(() => UserDialog, dialog => dialog.user)
    dialogues: UserDialog[];

    @OneToMany(() => VipKey, vipKey => vipKey.usedBy)
    usedKeys: VipKey[];
}
