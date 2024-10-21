// models/teamInfo.js
module.exports = (sequelize, DataTypes) => {
    const TeamInfo = sequelize.define('TeamInfo', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      match_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'PastMatches', // Reference the pastMatch table
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shortname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });

    TeamInfo.associate = function(models) {
      TeamInfo.belongsTo(models.PastMatch, { foreignKey: 'match_id' });
    };

    return TeamInfo;
};
