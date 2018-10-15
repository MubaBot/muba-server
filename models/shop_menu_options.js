module.exports = function(sequelize, DataTypes) {
  const shop_menu_options = sequelize.define(
    "shop_menu_options",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      OPTIONID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      MENUID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true }
    },
    {
      timestamps: false,
      tableName: "shop_menu_options",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_menu_options.associate = models => {
    shop_menu_options.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    shop_menu_options.belongsTo(models.shop_options, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "OPTIONID",
        allowNull: false
      },
      targetKey: "_id"
    });

    shop_menu_options.belongsTo(models.shop_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "MENUID",
        allowNull: false
      },
      targetKey: "_id"
    });

    shop_menu_options.hasMany(models.order_menu_option, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "OPTIONID",
        allowNull: false
      },
      sourceKey: "_id"
    });
  };

  return shop_menu_options;
};
