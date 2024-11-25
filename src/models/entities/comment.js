import { EntitySchema } from 'typeorm';

export const Comment = new EntitySchema({
    name: 'Comment',
    columns: {
        content: {
            type: 'varchar',
            length: 500,
        },
        createTime: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        commentID: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        postID: {
            type: 'int4',
            nullable: false,
        },
        // rootID: {
        //     type: 'uuid',
        //     nullable: false,
        //     default: () => 'uuid_generate_v4()',
        // },
        commentOwner: {
            type: 'uuid',
            nullable: false,
            onDelete: 'CASCADE',
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'commentOwner',
                referencedColumnName: 'id',
            },
            nullable: false,
            onDelete: 'CASCADE',
        },
        // rootComment: {
        //     type: 'many-to-one',
        //     target: 'Comment',
        //     joinColumn: {
        //         name: 'rootID',
        //         referencedColumnName: 'commentID',
        //     },
        //     nullable: true,
        //     onDelete: 'CASCADE',
        // },
        // post: {
        //     type: 'many-to-one',
        //     target: 'Post',
        //     joinColumn: {
        //         name: 'postID',
        //         referencedColumnName: 'PostID',
        //     },
        //     nullable: false,
        //     onDelete: 'CASCADE',
        // },
    },
});
