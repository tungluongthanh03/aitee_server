import { EntitySchema } from 'typeorm';

export const Comment = new EntitySchema({
    name: 'Comment',
    tableName: 'comments',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        content: {
            type: 'varchar',
            length: 500,
        },
        images: {
            type: 'json',
            nullable: true,
        },
        videos: {
            type: 'json',
            nullable: true,
        },
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
            onDelete: 'CASCADE',
            inverseSide: 'comments',
        },
        post: {
            type: 'many-to-one',
            target: 'Post',
            joinColumn: true,
            onDelete: 'CASCADE',
            inverseSide: 'comments',
        },
        root: {
            type: 'one-to-one',
            target: 'Comment',
            nullable: true,
            joinColumn: true,
            onDelete: 'CASCADE',
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         post:
 *           $ref: '#/components/schemas/Post'
 *         root:
 *           $ref: '#/components/schemas/Comment'
 */