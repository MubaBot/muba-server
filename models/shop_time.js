module.exports = function(sequelize, DataTypes) {
  const shop_time = sequelize.define(
    "shop_time",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      DAY: { type: DataTypes.STRING, unique: true, notNull: true },
      TIME: { type: DataTypes.STRING, notNull: true },
      TYPE: { type: DataTypes.STRING, notNull: true }
    },
    {
      timestamps: false,
      tableName: "shop_time",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_time.associate = models => {
    shop_time.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return shop_time;
};
