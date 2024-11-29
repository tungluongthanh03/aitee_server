import { EntitySchema } from 'typeorm';

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
            onDelete: 'CASCADE',
            inverseSide: 'reactions',
        },
        post: {
            target: 'Post',
            type: 'many-to-one',
            joinColumn: {
                name: 'postId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'reactions',
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
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
