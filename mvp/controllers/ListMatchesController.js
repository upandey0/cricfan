const secrets = require('../config/data.json');
const { Match, Team } = require('../models');

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

        // Calculate offset based on pageNumber
        const offset = pageNumber - 1;

        // If no cached data, make API call
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
                // Insert live match with matchStatus 'live'
                await insertMatchAndTeams(data, 'live');
            } else if (data.matchEnded) {
                pastMatches.push(data);
                // Insert past match with matchStatus 'completed'
                await insertMatchAndTeams(data, 'completed');
            } else if (!data.matchStarted && !data.matchEnded) {
                upcomingMatches.push(data);
                // Insert upcoming match with matchStatus 'upcoming'
                await insertMatchAndTeams(data, 'upcoming');
            }
        }

        // Send API response back to the client
        return res.status(200).json({
            success: true,
            liveMatches,
            pastMatches,
            upcomingMatches
        });

    } catch (error) {
        // General error handling
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
        // Check if match already exists
        const existingMatch = await Match.findOne({ where: { id: matchData.id } });
        if (existingMatch) {
            // Update match if it already exists
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
            // Insert new match into the Matches table
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
                matchStatus: matchStatus // 'live', 'upcoming', or 'completed'
            });

            // Insert teams into Teams table for the newly inserted match
            for (const team of matchData.teamInfo) {
                await Team.create({
                    id: team.id, // Assuming team has an 'id', if not you can generate a UUID here
                    name: team.name,
                    shortname: team.shortname,
                    img: team.img,
                    match_id: newMatch.id // Foreign key reference to Matches table
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
