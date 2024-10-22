const secrets = require('../config/data.json');
const { PastMatch, TeamInfo, Score, UpcomingMatch } = require('../models');  

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
            } else if (data.matchEnded) {
                pastMatches.push(data);
            } else if (!data.matchStarted && !data.matchEnded) {
                upcomingMatches.push(data);
            }
        }

        // Insert past matches into the database
        for (const pastMatch of pastMatches) {
            // Check if the match already exists in the database
            const existingMatch = await PastMatch.findOne({ where: { id: pastMatch.id } });

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
            const [match, created] = await PastMatch.upsert(matchData);

            // Ensure the match is inserted before inserting related data
            if (!match.id) {
                console.error("Match ID not found, skipping team info and score insertion.");
                continue;
            }

            // Insert team information for past matches
            try {
                for (const team of pastMatch.teamInfo) {
                    if (!team) {
                        console.log('Team Info Is Not Present in API');
                        continue;
                    }
                    const teamInfoData = {
                        name: team.name,
                        shortname: team.shortname,
                        img: team.img,
                        match_id: match.id  // Ensure valid match ID
                    };
                    await TeamInfo.create(teamInfoData);  // Use create for better control
                }
            } catch (error) {
                console.error("Error inserting team info: ", error);
            }

            // Insert score information for past matches
            for (const score of pastMatch.score) {
                const scoreData = {
                    r: score.r,
                    w: score.w,
                    o: score.o,
                    inning: score.inning,
                    match_id: match.id  // Ensure valid match ID
                };
                await Score.create(scoreData);
            }
        }

        // Insert or upsert upcoming matches into the database
        for (const upcomingMatch of upcomingMatches) {
            const matchData = {
                id: upcomingMatch.id,
                name: upcomingMatch.name,
                matchType: upcomingMatch.matchType,
                status: upcomingMatch.status,
                venue: upcomingMatch.venue,
                date: upcomingMatch.date,
                dateTimeGMT: upcomingMatch.dateTimeGMT,
                teams: upcomingMatch.teams,
                series_id: upcomingMatch.series_id,
                fantasyEnabled: upcomingMatch.fantasyEnabled,
                bbbEnabled: upcomingMatch.bbbEnabled,
                hasSquad: upcomingMatch.hasSquad,
                matchStarted: upcomingMatch.matchStarted,
                matchEnded: upcomingMatch.matchEnded
            };

            // Upsert (insert or update) upcoming match data into 'UpcomingMatch' table
            const [match, created] = await UpcomingMatch.upsert(matchData);

            // Ensure the match is inserted before inserting related data
            if (!match.id) {
                console.error("Upcoming Match ID not found, skipping team info insertion.");
                continue;
            }

            // Insert or update team information for upcoming matches
            try {
                for (const team of upcomingMatch.teamInfo) {  // Use teamInfo instead of teams
                    if (!team) continue;

                    const teamInfoData = {
                        name: team.name,
                        shortname: team.shortname,
                        img: team.img,
                        match_id: match.id  // Link team info to the match using match_id
                    };

                    // Upsert (insert or update) the team information in TeamInfo table
                    await TeamInfo.upsert(teamInfoData);
                }
            } catch (error) {
                console.error("Error inserting/updating team info for upcoming match: ", error);
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
