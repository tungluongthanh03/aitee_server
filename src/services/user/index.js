import path from 'path';
import fs from 'fs';

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
