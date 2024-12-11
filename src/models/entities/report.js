import { EntitySchema } from 'typeorm';

export const ReportUser = new EntitySchema({
    name: 'ReportUser',
    tableName: 'reportUsers',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        reportedId: {
            type: 'uuid',
            primary: true,
        },
        status: {
            type: 'boolean', // false if not yet processed
            default: false,
        },
        nReport: {
            type: 'int',
            default: 1,
        },
        reportRate: {
            type: 'float',
            default: 0.0,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        canRequestAdmin: {
            type: 'boolean',
            // default: false,
            default: true,
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'one-to-one',
            joinColumn: {
                name: 'reportedId',
            },
            onDelete: 'CASCADE',
        },
        // have: {
        //     target: 'ReportUserDetail',
        //     type: 'one-to-many',
        //     joinColumn: {
        //         name: 'reportId',
        //     },
        //     onDelete: 'CASCADE',
        //     inverseSide: 'report',
        // },
    },
});

export const ReportUserDetail = new EntitySchema({
    name: 'ReportUserDetail',
    tableName: 'reportUserDetail',
    columns: {
        reportedId: {
            type: 'uuid',
            primary: true,
        },
        reporterId: {
            type: 'uuid',
            primary: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        reporter: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: 'reporterId',
            onDelete: 'CASCADE',
        },
        reported: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: 'reportedId',
            onDelete: 'CASCADE',
        },
    },
});

export const ReportPost = new EntitySchema({
    name: 'ReportPost',
    tableName: 'reportPosts',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        postId: {
            type: 'uuid',
            primary: true,
        },
        status: {
            type: 'boolean', // false if not yet processed
            default: false,
        },
        nReport: {
            type: 'int',
            default: 1,
        },
        reportRate: {
            type: 'float',
            default: 0,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        canRequestAdmin: {
            type: 'boolean',
            // default: false,
            default: true,
        },
    },
    relations: {
        post: {
            target: 'Post',
            type: 'one-to-one',
            joinColumn: {
                name: 'postId',
            },
            onDelete: 'CASCADE',
        },
        // have: {
        //     target: 'ReportPostDetail',
        //     type: 'one-to-many',
        //     joinColumn: {
        //         name: 'reportId',
        //     },
        //     onDelete: 'CASCADE',
        //     inverseSide: 'report',
        // },
    },
});

export const ReportPostDetail = new EntitySchema({
    name: 'ReportPostDetail',
    tableName: 'reportPostDetail',
    columns: {
        postId: {
            type: 'uuid',
            primary: true,
        },
        reporterId: {
            type: 'uuid',
            primary: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        reporter: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: 'reporterId',
            onDelete: 'CASCADE',
        },
        post: {
            target: 'Post',
            type: 'many-to-one',
            joinColumn: 'postId',
            onDelete: 'CASCADE',
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         status:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         reactNotification:
 *           $ref: '#/components/schemas/ReactNotification'
 *         commentNotification:
 *           $ref: '#/components/schemas/CommentNotification'
 *         friendNotification:
 *           $ref: '#/components/schemas/FriendNotification'
 *         systemNotification:
 *           $ref: '#/components/schemas/SystemNotification'
 *     ReactNotification:
 *       type: object
 *       properties:
 *         notificationId:
 *           type: string
 *           format: uuid
 *         reactorId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *         notification:
 *           $ref: '#/components/schemas/Notification'
 *     CommentNotification:
 *       type: object
 *       properties:
 *         notificationId:
 *           type: string
 *           format: uuid
 *         commenterId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *         notification:
 *           $ref: '#/components/schemas/Notification'
 *     FriendNotification:
 *       type: object
 *       properties:
 *         notificationId:
 *           type: string
 *           format: uuid
 *         senderId:
 *           type: string
 *           format: uuid
 *         receiverId:
 *           type: string
 *           format: uuid
 *         notification:
 *           $ref: '#/components/schemas/Notification'
 *     SystemNotification:
 *       type: object
 *       properties:
 *         notificationId:
 *           type: string
 *           format: uuid
 *         message:
 *           type: string
 *         notification:
 *           $ref: '#/components/schemas/Notification'
 */
