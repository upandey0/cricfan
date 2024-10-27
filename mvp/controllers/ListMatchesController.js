const NodeCache = require('node-cache');
const secrets = require('../config/data.json');
const { Match, Team } = require('../models');

// Cache instance with TTL of 3 minutes (180 seconds)
const matchCache = new NodeCache({ stdTTL: 180 });

const ListmatchesController = async (req, res) => {
    try {
        const { pageNumber } = req.query;

        // Validate pageNumber
        if (!pageNumber || pageNumber <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request: pageNumber should be greater than 0"
            });
        }

        // Check if data is cached for this pageNumber
        const cachedMatches = matchCache.get(`matches_page_${pageNumber}`);

        if (cachedMatches) {
            // Cache hit, return cached data
            return res.status(200).json({
                success: true,
                liveMatches: cachedMatches.liveMatches,
                pastMatches: cachedMatches.pastMatches,
                upcomingMatches: cachedMatches.upcomingMatches,
                message: 'Data retrieved from cache'
            });
        }

        // Cache miss, make API call
        const offset = pageNumber - 1;
        const apiKey = secrets.API_KEY;
        const version = secrets.VERSION;
        const baseURL = secrets.BASE_URL;

        const cricListMatch = await fetch(`${baseURL}/${version}/currentMatches?apiKey=${apiKey}&offset=${offset}`);

        if (!cricListMatch.ok) {
            return res.status(cricListMatch.status).json({
                success: false,
                message: `API Error: ${cricListMatch.statusText}`
            });
        }

        const response = await cricListMatch.json();
        const toSendData = response.data;
        const liveMatches = [];
        const pastMatches = [];
        const upcomingMatches = [];

        // Categorize matches into live, past, and upcoming
        for (const data of toSendData) {
            if (data.matchStarted && !data.matchEnded) {
                liveMatches.push(data);
                await insertMatchAndTeams(data, 'live');
            } else if (data.matchEnded) {
                pastMatches.push(data);
                await insertMatchAndTeams(data, 'completed');
            } else if (!data.matchStarted && !data.matchEnded) {
                upcomingMatches.push(data);
                await insertMatchAndTeams(data, 'upcoming');
            }
        }

        // Cache the result for this pageNumber with a TTL of 3 minutes
        matchCache.set(`matches_page_${pageNumber}`, { liveMatches, pastMatches, upcomingMatches });

        // Send API response back to the client
        return res.status(200).json({
            success: true,
            liveMatches,
            pastMatches,
            upcomingMatches,
            message: 'Data retrieved from API'
        });

    } catch (error) {
        console.error("Error in ListmatchesController: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Helper function to insert match and team info into the database
const insertMatchAndTeams = async (matchData, matchStatus) => {
    try {
        const existingMatch = await Match.findOne({ where: { id: matchData.id } });
        if (existingMatch) {
            await existingMatch.update({
                matchStatus: matchStatus,
                matchStarted: matchData.matchStarted,
                matchEnded: matchData.matchEnded,
                fantasyEnabled: matchData.fantasyEnabled,
                bbbEnabled: matchData.bbbEnabled,
                hasSquad: matchData.hasSquad,
                status: matchData.status,
            });
        } else {
            const newMatch = await Match.create({
                id: matchData.id,
                name: matchData.name,
                matchType: matchData.matchType,
                status: matchData.status,
                venue: matchData.venue,
                date: matchData.date,
                dateTimeGMT: matchData.dateTimeGMT,
                series_id: matchData.series_id,
                fantasyEnabled: matchData.fantasyEnabled,
                bbbEnabled: matchData.bbbEnabled,
                hasSquad: matchData.hasSquad,
                matchStarted: matchData.matchStarted,
                matchEnded: matchData.matchEnded,
                matchStatus: matchStatus 
            });

            for (const team of matchData.teamInfo) {
                await Team.create({
                    id: team.id,
                    name: team.name,
                    shortname: team.shortname,
                    img: team.img,
                    match_id: newMatch.id
                });
            }
        }
    } catch (error) {
        console.error(`Error inserting/updating match ${matchData.id}: `, error);
    }
};

module.exports = {
    ListmatchesController
};
