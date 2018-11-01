module.exports = function(sequelize, DataTypes) {
  const shop_menu = sequelize.define(
    "shop_menu",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      MENUNAME: { type: DataTypes.STRING, notNull: true },
      PRICE: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      URL: { type: DataTypes.STRING },
      SOLD: { type: DataTypes.BOOLEAN, defaultValue: false },
      REP: { type: DataTypes.BOOLEAN, defaultValue: false } // 대표 메뉴
    },
    {
      timestamps: false,
      tableName: "shop_menu",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_menu.associate = models => {
    shop_menu.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    shop_menu.hasMany(models.sale, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "MENUID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop_menu.hasMany(models.shop_menu_options, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "MENUID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop_menu.hasMany(models.order_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "MENUID",
        allowNull: false
      },
      sourceKey: "_id"
    });
  };

  return shop_menu;
};
