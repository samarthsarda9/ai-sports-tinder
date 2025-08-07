import axios from 'axios';

export const fetchRecommendations = async (sportKey) => {
    try {
        const response = await axios.get('/recommendation', {
            params: {
                sport: sportKey
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        throw error;
    }
};