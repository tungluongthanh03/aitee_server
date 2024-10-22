import { EntitySchema } from 'typeorm';

const User = new EntitySchema({
    name: 'User',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        email: {
            type: 'varchar',
            unique: true,
        },
        username: {
            type: 'varchar',
        },
        password: {
            type: 'varchar',
        },
    },
});

export default User;
