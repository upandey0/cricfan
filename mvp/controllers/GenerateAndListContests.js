const { Contest } = require('../models');

const ListContests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        // Fetch contests with pagination and conditions
        const { rows: contests, count: totalContests } = await Contest.findAndCountAll({
            where: {
                is_active: true,
                is_entry_open: true
            },
            limit: pageSize,
            offset: offset
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalContests / pageSize);

        // Send paginated response
        res.status(200).json({
            page,
            pageSize,
            totalPages,
            totalContests,
            contests
        });
    } catch (error) {
        console.error("Error fetching contests:", error);
        res.status(500).json({ message: "Failed to fetch contests" });
    }
};

module.exports = { ListContests };
