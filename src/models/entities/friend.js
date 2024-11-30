import { EntitySchema } from 'typeorm';

export const Request = new EntitySchema({
    name: 'Request',
    tableName: 'requests',
    columns: {
        senderId: {
            type: 'uuid',
            primary: true,
        },
        receiverId: {
            type: 'uuid',
            primary: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        sender: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'senderId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'sentRequests',
        },
        receiver: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'receiverId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'receivedRequests',
        },
    },
});

export const Friend = new EntitySchema({
    name: 'Friend',
    tableName: 'friends',
    columns: {
        acceptorId: {
            type: 'uuid',
            primary: true,
        },
        acceptedId: {
            type: 'uuid',
            primary: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        acceptor: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'acceptorId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'acceptors',
        },
        accepted: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'acceptedId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'accepteds',
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Friend:
 *       type: object
 *       properties:
 *         acceptorId:
 *           type: string
 *           format: uuid
 *         acceptedId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         acceptor:
 *           $ref: '#/components/schemas/User'
 *         accepted:
 *           $ref: '#/components/schemas/User'
 *     Request:
 *       type: object
 *       properties:
 *         senderId:
 *           type: string
 *           format: uuid
 *         receiverId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         sender:
 *           $ref: '#/components/schemas/User'
 *         receiver:
 *           $ref: '#/components/schemas/User'
 */
