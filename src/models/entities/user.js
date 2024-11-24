import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
    name: 'User',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        email: {
            type: 'varchar',
            unique: true,
            length: 100,
        },
        username: {
            type: 'varchar',
            unique: true,
            length: 20,
        },
        phoneNumber: {
            type: 'varchar',
            unique: true,
            length: 15,
        },
        password: {
            type: 'varchar',
            length: 100,
        },
        firstName: {
            type: 'varchar',
            length: 15,
        },
        lastName: {
            type: 'varchar',
            length: 30,
        },
        sex: {
            type: 'enum',
            enum: ['male', 'female', 'other'],
        },
        birthday: {
            type: 'date',
        },
        address: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        avatar: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        online: {
            type: 'boolean',
            default: false,
        },
        biography: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        createTime: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        has: {
            type: 'many-to-many',
            target: 'GroupChat',  // Reference to the User entity
            joinTable: {
                name: 'groupChat_user',
                joinColumn: { name: 'userID', referencedColumnName: 'id' },
                inverseJoinColumn: { name: 'groupID', referencedColumnName: 'groupID' },
            },
        },

        isFriend: {
            type: 'many-to-many',
            target: 'User',  //
            joinTable: {
                name: 'is_friend',
                joinColumn: { name: 'userID1', referencedColumnName: 'id' },
                inverseJoinColumn: { name: 'userID2', referencedColumnName: 'id' },
            }
        }
    }
});
