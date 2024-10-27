const cron = require('node-cron');
const { Match, Contest } = require('../models');
const { Op } = require('sequelize');

const updateUpcomingToLive = async () => {
    try {
        const now = new Date();
        const timeOfLatestStart = await Contest.findAll({
            include: [
                {
                    model: Match,
                    required: true,
                    where: {
                        is_active: true,
                        is_entry_open: true
                    }
                }],
            
            order : ['dateTimeGMT', 'ASC'],
            raw: true

        })
        console.log(timeOfLatestStart)
        const earliestMatch = matchesWithContest[0];
        const earliestStartTime = new Date(earliestMatch.dateTimeGMT);

        console.log(`Earliest upcoming match scheduled at GMT: ${earliestStartTime}`);

    } catch (error) {
        console.error("Error updating match status:", error);
    }
};

// Schedule the job to run every second
cron.schedule('* * * * *', async () => {
    console.log('Updating Status of the Contest and Matches');
    await updateUpcomingToLive();
});
