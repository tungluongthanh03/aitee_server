import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        email: {
            type: 'varchar',
            unique: true,
            length: 100,
        },
        username: {
            type: 'varchar',
            unique: true,
            length: 20,
        },
        phoneNumber: {
            type: 'varchar',
            unique: true,
            length: 15,
        },
        password: {
            type: 'varchar',
            length: 100,
        },
        firstName: {
            type: 'varchar',
            length: 15,
        },
        lastName: {
            type: 'varchar',
            length: 30,
        },
        sex: {
            type: 'enum',
            enum: ['male', 'female', 'other'],
        },
        birthday: {
            type: 'date',
        },
        address: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        avatar: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        online: {
            type: 'boolean',
            default: false,
        },
        biography: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        posts: {
            target: 'Post',
            type: 'one-to-many',
            cascade: true,
        },
        reactions: {
            target: 'React',
            type: 'one-to-many',
            inverseSide: 'user',
        },
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           example: user@example.com
 *         username:
 *           type: string
 *           example: username123
 *         phoneNumber:
 *           type: string
 *           example: 1234567890
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         sex:
 *           type: string
 *           enum: ['male', 'female', 'other']
 *           example: male
 *         birthday:
 *           type: string
 *           format: date
 *           example: 1990-01-01
 *         address:
 *           type: string
 *           example: 123 Main St
 *         avatar:
 *           type: string
 *           example: http://example.com/avatar.jpg
 *         online:
 *           type: boolean
 *           example: true
 *         biography:
 *           type: string
 *           example: This is a biography.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00Z
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 *         reactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/React'
 */
