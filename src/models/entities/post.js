import { EntitySchema } from 'typeorm';

export const Post = new EntitySchema({
    name: 'Post',
    tableName: 'posts',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        content: {
            type: 'text',
        },
        images: {
            type: 'json',
            nullable: true,
        },
        videos: {
            type: 'json',
            nullable: true,
        },
        nViews: {
            type: 'int',
            default: 0,
        },
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
        updatedAt: {
            type: 'timestamp',
            updateDate: true,
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: true,
            onDelete: 'CASCADE',
            inverseSide: 'posts',
        },
        reactions: {
            target: 'React',
            type: 'one-to-many',
            inverseSide: 'post',
        },
        comments: {
            target: 'Comment',
            type: 'one-to-many',
            cascade: true,
            inverseSide: 'post',
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
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
 *         nViews:
 *           type: integer
 *           default: 0
 *         nReactions:
 *           type: integer
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         reactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/React'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 */
