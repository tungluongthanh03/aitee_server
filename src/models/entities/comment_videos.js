import { EntitySchema } from 'typeorm';

export const comment_videos = new EntitySchema({
    name: 'comment_videos',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        video: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
    },
    // relations: {
    //     comment: {
    //         type: 'many-to-one',
    //         target: 'Comment',
    //         joinColumn: {
    //             name: 'commentVideoID',
    //             referencedColumnName: 'commentID',
    //         },
    //         nullable: false,
    //         onDelete: 'CASCADE',
    //     },
    // },
});
