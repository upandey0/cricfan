module.exports = (sequelize, DataTypes) => {
    const Teams = sequelize.define('Team', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        },
        match_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'matches',  // Reference the 'matches' table explicitly
                key: 'id'
            },
            onDelete: 'CASCADE',  
            onUpdate: 'CASCADE'   
        }
    }, {
        tableName: 'teams',  
        timestamps: false    
    });

    Teams.associate = models => {
        Teams.belongsTo(models.Match, {
            foreignKey: 'match_id',
            as: 'match'
        });
    };

    return Teams;
};
