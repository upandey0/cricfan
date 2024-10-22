module.exports = (sequelize, DataTypes) => {
    const Contest = sequelize.define('Contest', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        match_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'UpcomingMatches', // name of the referenced model
                key: 'id'               // key in the referenced model
            },
            onDelete: 'CASCADE', // optional: define what happens on delete
            onUpdate: 'CASCADE'   // optional: define what happens on update
        },
        contest_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contest_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active : {
            type: DataTypes.BOOLEAN,
            allowNull : false
        },
        entry_fee: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        
    });

    // Associations can be defined here if needed
    Contest.associate = (models) => {
        Contest.belongsTo(models.UpcomingMatch, {
            foreignKey: 'match_id',
            as: 'UpcomingMatches'
        });
    };

    return Contest;
};
