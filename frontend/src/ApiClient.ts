import axios from 'axios';
import { Feedback } from './data/feedback';
import { User } from './data/user';
import { Wastebin } from './data/wastebin';

const apiClient = axios.create({
    baseURL: 'http://localhost:5041/api',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
}); 

export const fetchUser = async (data: number) => {
    try {
        console.log("Fetching user");
        const response = await apiClient.get(`/user/${data}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}; 

export const updateUser = async (userId: number, data: Partial<Omit<User, 'id'>>) => {
    try {
        console.log("Updating user", data);
        const response = await apiClient.put(`/user/${userId}`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};

export const fetchWastebins = async () => {
    try {
        console.log("Fetching Wastebins");
        const response = await apiClient.get('/wastebin');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}; 

export const fetchWastebin = async (data: number) => {
    try {
        console.log("Fetching Wastebin", data);
        const response = await apiClient.get(`/wastebin/${data}`, );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}; 

export const createWastebin = async (data: Partial<Omit<Wastebin, 'id'>>) => {
    try {
        // post 
        console.log("Creating new Wastebin", data);
        const response = await apiClient.post(`/wastebin/`, data);
        console.log(response.data);
    } catch (error) {
        console.error('Error creating data:', error);
    }
};

export const updateWastebin = async (wastebinId: number, data: Partial<Omit<Wastebin, 'id'>>) => {
    try {
        // post 
        console.log("Updating Wastebin", data);
        const response = await apiClient.put(`/wastebin/${wastebinId}`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
    }
}; 

export const deleteWastebin = async (data: number) => {
    try {
        console.log("Deleting Wastebin", data);
        const response = await apiClient.delete(`/wastebin/${data}`,);
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};

export const createFeedback = async (data: Partial<Omit<Feedback, 'id'>>) => {
    try {
        // post 
        console.log("Creating new Feedback", data);
        const response = await apiClient.post(`/feedback/`, data);
        console.log(response.data);
    } catch (error) {
        console.error('Error creating feedback data:', error);
    }
};

export default apiClient;