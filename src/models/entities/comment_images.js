import { EntitySchema } from 'typeorm';

export const comment_images = new EntitySchema({
    name: 'comment_images',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        iamge: {
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
    //             name: 'commentImageID',
    //             referencedColumnName: 'commentID',
    //         },
    //         nullable: false,
    //         onDelete: 'CASCADE',
    //     },
    // },
});
