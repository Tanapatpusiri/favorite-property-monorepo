import { axiosInstance } from '../utils';

const PREFIX_FAVORITE = '/favorites';

export const favoriteApi = {
    getAll: async (userId: string) => {
        const res = await axiosInstance.get<string[]>(`${PREFIX_FAVORITE}/${encodeURIComponent(userId)}`);
        return res.data;
    },
    add: async (userId: string, propertyId: string) => {
        const res = await axiosInstance.post<string[]>(PREFIX_FAVORITE, { userId, propertyId });
        return res.data;
    },
    remove: async (userId: string, propertyId: string) => {
        const res = await axiosInstance.delete<string[]>(PREFIX_FAVORITE, { data: { userId, propertyId } });
        return res.data;
    },
};
