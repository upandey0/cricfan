const cron = require('node-cron')
const { Match, Contest } = require('../models');  
const { v4: uuidv4 } = require('uuid');
const schedule = require('node-schedule')

// Function to create contests for upcoming matches if they don't already have one
const createContestsForUpcomingMatches = async () => {
    try {
        // Find all upcoming matches
        const upcomingMatches = await Match.findAll({
            where: { matchStatus: 'upcoming' }
        });

        // Loop through each upcoming match
        for (const match of upcomingMatches) {
            // Check if a contest exists for this match ID
            const existingContest = await Contest.findOne({
                where: { match_id: match.id }
            });

            if (!existingContest) {
                // Create a new contest for this match
                await Contest.create({
                    id: uuidv4(),
                    match_id: match.id,
                    name: `Contest for Match ${match.id}`,
                    is_active: true,
                    entry_fees: 10.0 ,
                    is_entry_open : true
                });

                const liveTime = new Date(match.dateTimeGMT)
                liveTime.setHours(liveTime.getHours() + 5);
                liveTime.setMinutes(liveTime.getMinutes() + 30);
                liveTime.setSeconds(liveTime.getSeconds() + 30);
                schedule.scheduleJob(liveTime, async ()=>{
                    try {
                        console.log(`job Created for Match id ${match.id}`)
                        
                    } catch (error){
                        
                    }
                })

                console.log(`Created contest for match ID: ${match.id}`);
            } else {
                console.log(`Contest already exists for match ID: ${match.id}`);
            }
        }
    } catch (error) {
        console.error('Error creating contests for upcoming matches:', error);
    }
};

cron.schedule('*/10 * * * *', async () => {
    console.log('Running auto-contest creation job...');
    await createContestsForUpcomingMatches();
});
