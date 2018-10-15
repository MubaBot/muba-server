module.exports = function(sequelize, DataTypes) {
  const shop_options = sequelize.define(
    "shop_options",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      OPTIONNAME: { type: DataTypes.STRING, notNull: true },
      PRICE: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
    },
    {
      timestamps: false,
      tableName: "shop_options",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_options.associate = models => {
    shop_options.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    shop_options.hasMany(models.shop_menu_options, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "OPTIONID",
        allowNull: false
      },
      sourceKey: "_id"
    });
  };

  return shop_options;
};
