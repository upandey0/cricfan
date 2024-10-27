module.exports = (sequelize, DataType) => {
    const Matches = sequelize.define('Match', {
        id: {
            type: DataType.UUID,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataType.STRING,
            allowNull: false
        },
        matchType: {
            type: DataType.STRING,
            allowNull: false
        },
        status: {
            type: DataType.STRING,
            allowNull: true
        },
        venue: {
            type: DataType.STRING,
            allowNull: false
        },
        date: {
            type: DataType.DATEONLY,
            allowNull: false
        },
        dateTimeGMT: {
            type: DataType.DATE,
            allowNull: false
        },
        series_id: {
            type: DataType.UUID,
            allowNull: false
        },
        fantasyEnabled: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        bbbEnabled: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        hasSquad: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        matchStarted: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        matchEnded: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        matchStatus: {
            type: DataType.STRING
        }
    }, {
        tableName: 'matches',
        timestamps: false  // Disable timestamps
    });

    Matches.associate = models => {
        Matches.hasMany(models.Team, {
            foreignKey: 'match_id',
            as: 'teams'
        });

        // Add hasMany association with Contest
        Matches.hasMany(models.Contest, {
            foreignKey: 'match_id',
            as: 'contests'
        });
    };

    return Matches;
};
