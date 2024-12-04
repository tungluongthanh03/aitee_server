import { EntitySchema } from 'typeorm';

export const GroupChat = new EntitySchema({
    name: 'GroupChat',
    columns: {
        groupID: {
            type: 'uuid',
            primary: true,
            generated: "uuid",
        },
        name: {
            type: 'varchar',
            length: 15,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        avatar: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },

    },
    relations: {
        createBy: {
            type: 'many-to-one',
            target: 'User',  // Reference to the User entity
            joinColumn: { name: 'createBy' },
        },
        has: {
            type: 'many-to-many',
            target: 'User',  // Reference to the User entity
            joinTable: {
                name: 'groupChat_user',
                joinColumn: { name: 'groupID', referencedColumnName: 'groupID' },
                inverseJoinColumn: { name: 'userID', referencedColumnName: 'id' },
            },
        },
    },
});
