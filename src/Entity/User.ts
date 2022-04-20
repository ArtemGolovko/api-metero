import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity()
export class User {
    @PrimaryKey()
    username!: string

    @Property()
    firstName!: string

    @Property()
    lastName!: string
}