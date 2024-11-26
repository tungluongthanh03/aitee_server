import { EntitySchema } from 'typeorm';

export const Comment = new EntitySchema({
    name: 'Comment',
    columns: {
        content: {
            type: 'text',
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
        images: {
            type: 'json',
            nullable: true,
        },
        videos: {
            type: 'json',
            nullable: true,
        },
        rootID: {
            type: 'uuid',
            nullable: true,
        },
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
        rootComment: {
            type: 'many-to-one',
            target: 'Comment',
            joinColumn: {
                name: 'rootID',
                referencedColumnName: 'commentID',
            },
            nullable: true,
            onDelete: 'CASCADE',
        },
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
