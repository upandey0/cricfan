module.exports = (sequelize, DataType) => {
    const Contest = sequelize.define('Contest', {
        id: {
            type: DataType.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataType.UUIDV4
        },
        match_id: {
            type: DataType.UUID,
            allowNull: false,
            references: {
                model: 'matches',  // Refers to the 'matches' table
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        name: {
            type: DataType.STRING,
            allowNull: false
        },
        is_active: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        entry_fees: {
            type: DataType.FLOAT,
            allowNull: false
        },
        is_entry_open : {
            type: DataType.BOOLEAN,
            allowNull : false
        }
    }, {
        tableName: 'contests',
        timestamps: true,  // Enable timestamps (createdAt and updatedAt)
    });

    Contest.associate = models => {
        Contest.belongsTo(models.Match, {
            foreignKey: 'match_id',
            as: 'match'
        });
    };

    return Contest;
};
