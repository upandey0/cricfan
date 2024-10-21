const secrets = require('../config/data.json');
const { PastMatch, TeamInfo, Score } = require('../models');  

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

        for (const data of toSendData) {
            if (data.matchStarted && !data.matchEnded) {
                liveMatches.push(data);
            } else if (data.matchEnded) {
                pastMatches.push(data);
            } else if (!data.matchStarted && !data.matchEnded) {
                upcomingMatches.push(data);
            }
        }

        // Insert past matches into the database
        for (const pastMatch of pastMatches) {
            // Check if match already exists in the database
            const existingMatch = await PastMatch.findOne({ where: { id: pastMatch.id } });

            // Skip insertion if match already exists
            if (existingMatch) {
                console.log(`Match with ID ${pastMatch.id} already exists, skipping insertion.`);
                continue;
            }

            const matchData = {
                id: pastMatch.id,
                name: pastMatch.name,
                matchType: pastMatch.matchType,
                status: pastMatch.status,
                venue: pastMatch.venue,
                date: pastMatch.date,
                dateTimeGMT: pastMatch.dateTimeGMT,
                teams: pastMatch.teams,
                series_id: pastMatch.series_id,
                fantasyEnabled: pastMatch.fantasyEnabled,
                bbbEnabled: pastMatch.bbbEnabled,
                hasSquad: pastMatch.hasSquad,
                matchStarted: pastMatch.matchStarted,
                matchEnded: pastMatch.matchEnded
            };

            // Insert match data into 'PastMatch' table
            const match = await PastMatch.create(matchData);

            console.log('Insertion till Here is Done and Then Exception Will be raise')

            // Insert team information 
            try {
                for (const team of pastMatch.teamInfo) {
                    if (!team) {
                        console.log('Team Info Is Not Present in API')
                        continue;
                    }
                    const teamInfoData = {
                        name: team.name,
                        shortname: team.shortname,
                        img: team.img,
                        match_id: match.id  
                    };
                    await TeamInfo.create(teamInfoData);
                }
            } catch (error) {

            }



            // Insert score information 
            for (const score of pastMatch.score) {
                const scoreData = {
                    r: score.r,
                    w: score.w,
                    o: score.o,
                    inning: score.inning,
                    match_id: match.id  
                };
                await Score.create(scoreData);
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

module.exports = {
    ListmatchesController
};
