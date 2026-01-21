import { axiosInstance } from '../utils';
import { User } from '../types';

const PREFIX_USER = '/users';

export const userApi = {
    getAll: async () => {
        const res = await axiosInstance.get<User[]>(PREFIX_USER);
        return res.data;
    },
    create: async (username: string) => {
        const res = await axiosInstance.post<User>(PREFIX_USER, { username });
        return res.data;
    },
};
