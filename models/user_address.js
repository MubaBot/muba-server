module.exports = function(sequelize, DataTypes) {
  const user_address = sequelize.define(
    "user_address",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      USERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      ADDRESS1: { type: DataTypes.STRING },
      ADDRESS2: { type: DataTypes.STRING },
      LAT: { type: DataTypes.DOUBLE },
      LNG: { type: DataTypes.DOUBLE }
    },
    {
      timestamps: true,
      tableName: "user_address",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  user_address.associate = models => {
    user_address.belongsTo(models.user, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "USERID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return user_address;
};
