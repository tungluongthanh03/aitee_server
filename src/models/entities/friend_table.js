import { EntitySchema } from 'typeorm';

export const RequestFriend = new EntitySchema({
    name: 'RequestFriend',
    columns: {
        requestID: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        sender: {
            type: 'uuid',
            nullable: false,
        },
        createTime: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        status: {
            type: 'bool',
            nullable: false,
            default: false,
        },
        reciever: {
            type: 'uuid',
            nullable: false,
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'reciever',
                referencedColumnName: 'id',
            },
            nullable: false,
            onDelete: 'CASCADE',
        },
    },
});
