module.exports = (sequelize, DataTypes) => {
    const upcomingMatches = sequelize.define('UpcomingMatch', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        matchType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        venue: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dateTimeGMT: {
            type: DataTypes.DATE,
            allowNull: false
        },
        teams: {
            type: DataTypes.JSON,
            allowNull: false
        },
        series_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        fantasyEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        bbbEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        hasSquad: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        matchStarted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        matchEnded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })
    upcomingMatches.associate = function(models) {
        upcomingMatches.hasMany(models.TeamInfo, { foreignKey: 'match_id' });    
    };
    
    return upcomingMatches
}