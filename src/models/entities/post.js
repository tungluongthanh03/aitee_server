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
        },
        reactions: {
            target: 'React',
            type: 'one-to-many',
            inverseSide: 'post',
        },
    },
});

export const React = new EntitySchema({
    name: 'React',
    tableName: 'reacts',
    columns: {
        userId: {
            type: 'uuid',
            primary: true,
        },
        postId: {
            type: 'uuid',
            primary: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: {
                name: 'userId',
            },
        },
        post: {
            target: 'Post',
            type: 'many-to-one',
            joinColumn: {
                name: 'postId',
            },
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
 *     React:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         post:
 *           $ref: '#/components/schemas/Post'
 */
