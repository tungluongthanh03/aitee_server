import { MessageRepo } from "../../models/index.js";

export const storeMessage = async (message) => {
    try {
        const newMessage = await MessageRepo.create(message);
        
        return newMessage;
    } catch (error) {
        console.log(error);
        return null;
    }
};