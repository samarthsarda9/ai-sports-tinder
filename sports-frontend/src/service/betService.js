import axios from 'axios';

export const placeBet = async (betData) => {
    try {
        const response = await axios.post('/bets', betData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error ("Failed to place bet:", error.response?.data);
        return { success: false, error: error.response?.data?.error || 'Failed to place bet'}
    };
};

// export const placeBet = async (betData) => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     // Mock successful bet placement
//     console.log('Placing bet:', betData);
    
//     return {
//         success: true,
//         betId: 'bet_' + Date.now(),
//         message: 'Bet placed successfully!'
//     };
// };