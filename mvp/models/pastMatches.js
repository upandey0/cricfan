// models/pastMatch.js
module.exports = (sequelize, DataTypes) => {
  const PastMatch = sequelize.define('PastMatch', {
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
      allowNull: true
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
      type: DataTypes.JSON, // Change to JSON instead of ARRAY for better flexibility
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
  });

  PastMatch.associate = function(models) {
    PastMatch.hasMany(models.TeamInfo, { foreignKey: 'match_id' });
    PastMatch.hasMany(models.Score, { foreignKey: 'match_id' });
  };

  return PastMatch;
};
