import { AppDataSource } from '../data-source.js';
import expressLoader from './express-loader.js';

export default async function loader(app) {
    try {
        await AppDataSource.initialize();
        expressLoader(app);
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
