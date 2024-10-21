// models/score.js
module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define('Score', {
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
          model: 'PastMatches',
          key: 'id'
        }
      },
      inning: {
        type: DataTypes.STRING,
        allowNull: false
      },
      r: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      w: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      o: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    });

    Score.associate = function(models) {
      Score.belongsTo(models.PastMatch, { foreignKey: 'match_id' });
    };

    return Score;
};
