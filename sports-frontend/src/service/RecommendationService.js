import axios from 'axios';

// const mockRecommendations = {
//     baseball_mlb: [
//         {
//             id: 1,
//             player: "Aaron Judge",
//             team: "New York Yankees",
//             opponent: "Boston Red Sox",
//             sport: "MLB",
//             type: "HITS",
//             line: 0.5,
//             odds: -110,
//             overUnder: "OVER",
//             gameTime: "2024-08-07T19:05:00Z",
//             description: "Aaron Judge to hit over 0.5 home runs",
//             game: { id: "mlb_nyy_bos_20240807" },
//             aiAnalysis: {
//                 recommendation: "Good Bet",
//                 reasoning: "Aaron Judge is a prolific home run hitter and has a favorable matchup against the Red Sox's starting pitcher.",
//                 confidence: 75,
//                 keyFactors: ["Favorable matchup", "Recent performance"],
//                 riskLevel: "Medium"
//             }
//         },
//         {
//             id: 2,
//             player: "Shohei Ohtani",
//             team: "Los Angeles Angels",
//             opponent: "Houston Astros",
//             sport: "MLB",
//             type: "STRIKES",
//             line: 7.5,
//             odds: +120,
//             overUnder: "OVER",
//             gameTime: "2024-08-07T20:10:00Z",
//             description: "Shohei Ohtani to record over 7.5 strikeouts",
//             game: { id: "mlb_laa_hou_20240807" },
//             aiAnalysis: {
//                 recommendation: "Strong Bet",
//                 reasoning: "Ohtani has been dominant on the mound this season and the Astros have a high strikeout rate against right-handed pitchers.",
//                 confidence: 85,
//                 keyFactors: ["High strikeout rate of opponent", "Ohtani's recent form"],
//                 riskLevel: "Low"
//             }
//         }
//     ],
//     basketball_nba: [
//         {
//             id: 3,
//             player: "LeBron James",
//             team: "Los Angeles Lakers",
//             opponent: "Golden State Warriors",
//             sport: "NBA",
//             type: "POINTS",
//             line: 25.5,
//             odds: -115,
//             overUnder: "OVER",
//             gameTime: "2024-08-07T22:30:00Z",
//             description: "LeBron James to score over 25.5 points",
//             game: { id: "nba_lal_gsw_20240807" },
//             aiAnalysis: {
//                 recommendation: "Risky Bet",
//                 reasoning: "LeBron's scoring can be inconsistent, and the Warriors are a strong defensive team. However, he is capable of high-scoring games.",
//                 confidence: 60,
//                 keyFactors: ["Strong opponent defense", "LeBron's potential for high scoring"],
//                 riskLevel: "High"
//             }
//         },
//         {
//             id: 4,
//             player: "Stephen Curry",
//             team: "Golden State Warriors",
//             opponent: "Los Angeles Lakers",
//             sport: "NBA",
//             type: "ASSISTS",
//             line: 4.5,
//             odds: +130,
//             overUnder: "UNDER",
//             gameTime: "2024-08-07T22:30:00Z",
//             description: "Stephen Curry to make over 4.5 three pointers",
//             game: { id: "nba_lal_gsw_20240807" },
//             aiAnalysis: {
//                 recommendation: "Good Bet",
//                 reasoning: "Curry is the greatest shooter of all time and is always a threat to make a high number of three-pointers.",
//                 confidence: 80,
//                 keyFactors: ["Historical performance", "High volume of three-point attempts"],
//                 riskLevel: "Medium"
//             }
//         }
//     ],
//     americanfootball_nfl: [
//         {
//             id: 5,
//             player: "Patrick Mahomes",
//             team: "Kansas City Chiefs",
//             opponent: "Buffalo Bills",
//             sport: "NFL",
//             type: "PASSING",
//             line: 285.5,
//             odds: -110,
//             overUnder: "UNDER",
//             gameTime: "2024-08-08T20:20:00Z",
//             description: "Patrick Mahomes to throw over 285.5 passing yards",
//             game: { id: "nfl_kc_buf_20240808" },
//             aiAnalysis: {
//                 recommendation: "Avoid",
//                 reasoning: "The Bills have a top-ranked pass defense, and this is expected to be a close game with a lot of rushing attempts.",
//                 confidence: 40,
//                 keyFactors: ["Strong opponent pass defense", "Game script may favor rushing"],
//                 riskLevel: "High"
//             }
//         }
//     ]
// };

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
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // return mockRecommendations[sportKey] || mockRecommendations.baseball_mlb;
};