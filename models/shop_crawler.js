module.exports = function(sequelize, DataTypes) {
  const shop_crawler = sequelize.define(
    "shop_crawler",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      SEARCHURL: { type: DataTypes.STRING }
    },
    {
      timestamps: false,
      tableName: "shop_crawler",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_crawler.associate = models => {
    shop_crawler.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return shop_crawler;
};
