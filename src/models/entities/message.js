import { EntitySchema } from 'typeorm';

export const Message = new EntitySchema({
    name: 'Message',
    columns: {
        messageID: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        content: {
            type: 'text',
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        images: {
            type: 'simple-array', // Can store image URLs as array
            nullable: true,
        },
        videos: {
            type: 'simple-array', // Can store video URLs as array
            nullable: true,
        },
    },
    relations: {
        sendFrom: {
            type: 'many-to-one',
            target: 'User', // Reference to the User entity
            joinColumn: { name: 'sendFrom' },
        },
        sendToUser: {
            type: 'many-to-one',
            target: 'User', // Reference to the User entity
            joinColumn: { name: 'sendToUser' },
        },
        sendToGroupChat: {
            type: 'many-to-one',
            target: 'GroupChat', // Reference to the User entity
            joinColumn: { name: 'sendToGroupChat' },
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         messageID:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *         sendFrom:
 *           $ref: '#/components/schemas/User'
 *         sendToUser:
 *           $ref: '#/components/schemas/User'
 *         sendToGroupChat:
 *           $ref: '#/components/schemas/GroupChat'
 */
