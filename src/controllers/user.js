import { AppDataSource } from '../data-source.js';
import { User } from '../models/index.js';

const UserRepo = AppDataSource.getRepository(User);

const getUsers = async (req, res) => {
    const users = await UserRepo.find();
    res.status(200).send(users);
};

const getUser = async (req, res) => {
    res.status(200).send('User details');
};

const createUser = async (req, res) => {
    const user = await UserRepo.create(req.body);
    const results = await UserRepo.save(user);
    res.status(201).send(results);
};

const updateUser = async (req, res) => {
    res.status(200).send('User updated');
};

const deleteUser = async (req, res) => {
    res.status(200).send('User deleted');
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
