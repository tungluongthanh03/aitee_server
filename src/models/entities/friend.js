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

export const Block = new EntitySchema({
    name: 'Block',
    tableName: 'blocks',
    columns: {
        blockerId: {
            type: 'uuid',
            primary: true,
        },
        blockedId: {
            type: 'uuid',
            primary: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        blocker: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'blockerId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'blockers',
        },
        blocked: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'blockedId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'blockeds',
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
 *     Block:
 *       type: object
 *       properties:
 *         blockerId:
 *           type: string
 *           format: uuid
 *         blockedId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         blocker:
 *           $ref: '#/components/schemas/User'
 *         blocked:
 *           $ref: '#/components/schemas/User'
 */
