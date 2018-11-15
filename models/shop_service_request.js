module.exports = function(sequelize, DataTypes) {
  const shop_service_request = sequelize.define(
    "shop_service_request",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      DAY: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      PRICE: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      USERNAME: { type: DataTypes.STRING, notNull: true },
      ADMISSION: { type: DataTypes.BOOLEAN },
      ACCOUNT: { type: DataTypes.STRING, notNull: true }
    },
    {
      timestamps: true,
      tableName: "shop_service_request",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_service_request.associate = models => {
    shop_service_request.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return shop_service_request;
};
