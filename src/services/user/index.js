import path from 'path';
import fs from 'fs';
import { UserRepo } from '../../models/index.js';

export const deleteUserImages = (user) => {
    const dir = 'uploads/images';

    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error('Error when reading directory', err);
            return;
        }

        const userImages = files.filter((file) => file.startsWith(`${user.id}___`));
        console.log('User images:', userImages);

        userImages.forEach((file) => {
            const filePath = path.join(dir, file);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error when deleting file: ${file}`, err);
                } else {
                    console.log(`File ${file} was deleted`);
                }
            });
        });
    });
};

export const getFriendList = async (userId) => {
    try {
        const list = await UserRepo.query(
            `SELECT 
                u.ID AS "targetId",
                u.username AS "targetName",
                u.avatar AS "targetAvatar"
            FROM 
                is_friend f
            JOIN 
                "user" u 
            ON 
                (f."userID1" = u.ID OR f."userID2" = u.ID)
            WHERE 
                (f."userID1" = $1 OR f."userID2" = $1)
                AND u.ID != $1;
            `,
            [userId],
        );
        return list;
    } catch (error) {
        console.error('Error fetching list: ', error);
        return [];
    }
};
