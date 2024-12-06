import { EntitySchema } from 'typeorm';

export const Notification = new EntitySchema({
    name: 'Notification',
    tableName: 'notifications',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        status: {
            type: 'boolean',
            default: false,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        userId: {
            type: 'uuid',
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: true,
            onDelete: 'CASCADE',
            inverseSide: 'notifications',
        },
        reactNotification: {
            target: 'ReactNotification',
            type: 'one-to-one',
            cascade: true,
            inverseSide: 'notification',
        },
        commentNotification: {
            target: 'CommentNotification',
            type: 'one-to-one',
            cascade: true,
            inverseSide: 'notification',
        },
        friendNotification: {
            target: 'FriendNotification',
            type: 'one-to-one',
            cascade: true,
            inverseSide: 'notification',
        },
        systemNotification: {
            target: 'SystemNotification',
            type: 'one-to-one',
            cascade: true,
            inverseSide: 'notification',
        },
    },
});

export const ReactNotification = new EntitySchema({
    name: 'ReactNotification',
    tableName: 'react_notifications',
    columns: {
        notificationId: {
            type: 'uuid',
            primary: true,
        },
        reactorId: {
            type: 'uuid',
        },
        postId: {
            type: 'uuid',
        },
    },
    relations: {
        notification: {
            target: 'Notification',
            type: 'one-to-one',
            joinColumn: {
                name: 'notificationId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'reactNotification',
        },
    },
});

export const CommentNotification = new EntitySchema({
    name: 'CommentNotification',
    tableName: 'comment_notifications',
    columns: {
        notificationId: {
            type: 'uuid',
            primary: true,
        },
        commenterId: {
            type: 'uuid',
        },
        postId: {
            type: 'uuid',
        },
    },
    relations: {
        notification: {
            target: 'Notification',
            type: 'one-to-one',
            joinColumn: {
                name: 'notificationId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'commentNotification',
        },
    },
});

export const FriendNotification = new EntitySchema({
    name: 'FriendNotification',
    tableName: 'friend_notifications',
    columns: {
        notificationId: {
            type: 'uuid',
            primary: true,
        },
        friendId: {
            type: 'uuid',
        },
        action: {
            type: 'enum',
            enum: ['request', 'accept'],
        },
    },
    relations: {
        notification: {
            target: 'Notification',
            type: 'one-to-one',
            joinColumn: {
                name: 'notificationId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'friendNotification',
        },
    },
});

export const SystemNotification = new EntitySchema({
    name: 'SystemNotification',
    tableName: 'system_notifications',
    columns: {
        notificationId: {
            type: 'uuid',
            primary: true,
        },
        message: {
            type: 'text',
        },
    },
    relations: {
        notification: {
            target: 'Notification',
            type: 'one-to-one',
            joinColumn: {
                name: 'notificationId',
            },
            onDelete: 'CASCADE',
            inverseSide: 'systemNotification',
        },
    },
});
