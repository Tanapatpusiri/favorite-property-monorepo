import { axiosInstance } from '../utils';
import { Property } from '../types';

const PREFIX_PROPERTY = '/properties';

export const propertyApi = {
    getAll: async () => {
        const res = await axiosInstance.get<Property[]>(PREFIX_PROPERTY);
        return res.data;
    },
    getById: async (id: string) => {
        const res = await axiosInstance.get<Property>(`${PREFIX_PROPERTY}/${encodeURIComponent(id)}`);
        return res.data;
    },
};
