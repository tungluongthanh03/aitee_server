import {
    NotificationRepo,
    ReactNotificationRepo,
    CommentNotificationRepo,
    FriendNotificationRepo,
    SystemNotificationRepo,
} from '../../models/index.js';

export const createReactNotification = async (user, reactorId, postId) => {
    const notification = NotificationRepo.create({ user });
    await NotificationRepo.save(notification);

    const reactNotification = ReactNotificationRepo.create({ notification, reactorId, postId });
    await ReactNotificationRepo.save(reactNotification);
    return reactNotification;
};

export const createCommentNotification = async (user, commenterId, postId) => {
    const notification = NotificationRepo.create({ user });
    await NotificationRepo.save(notification);

    const commentNotification = CommentNotificationRepo.create({
        notification,
        commenterId,
        postId,
    });
    await CommentNotificationRepo.save(commentNotification);
    return commentNotification;
};

export const createFriendNotification = async (user, friendId, action) => {
    const notification = NotificationRepo.create({ user });
    await NotificationRepo.save(notification);

    const friendNotification = FriendNotificationRepo.create({ notification, friendId, action });
    await FriendNotificationRepo.save(friendNotification);
    return friendNotification;
};

export const createSystemNotification = async (user, message) => {
    const notification = NotificationRepo.create({ user });
    await NotificationRepo.save(notification);

    const systemNotification = SystemNotificationRepo.create({ notification, message });
    await SystemNotificationRepo.save(systemNotification);
    return systemNotification;
};

export const removeReactNotification = async (user, reactorId, postId) => {
    // find all notifications of the user
    const notifications = await NotificationRepo.find({
        where: { userId: user.id },
        relations: ['reactNotification'],
    });
    if (!notifications.length) {
        return;
    }

    // find the react notification
    const notification = notifications.find(
        (n) =>
            n.reactNotification &&
            n.reactNotification.reactorId === reactorId &&
            n.reactNotification.postId === postId,
    );

    if (!notification) {
        return;
    }

    // remove the notification
    await NotificationRepo.remove(notification);
};

export const removeCommentNotification = async (user, commenterId, postId) => {
    // find all notifications of the user
    const notifications = await NotificationRepo.find({
        where: { userId: user.id },
        relations: ['commentNotification'],
    });
    if (!notifications.length) {
        return;
    }

    // find the comment notification
    const notification = notifications.find(
        (n) =>
            n.commentNotification &&
            n.commentNotification.commenterId === commenterId &&
            n.commentNotification.postId === postId,
    );

    if (!notification) {
        return;
    }

    // remove the notification
    await NotificationRepo.remove(notification);
};

export const removeFriendNotification = async (user, friendId, action) => {
    // find all notifications of the user
    const notifications = await NotificationRepo.find({
        where: { userId: user.id },
        relations: ['friendNotification'],
    });

    if (!notifications.length) {
        return;
    }

    // find the friend notification
    const notification = notifications.find(
        (n) =>
            n.friendNotification &&
            n.friendNotification.friendId === friendId &&
            n.friendNotification.action === action,
    );

    if (!notification) {
        return;
    }

    // remove the notification
    await NotificationRepo.remove(notification);
};
