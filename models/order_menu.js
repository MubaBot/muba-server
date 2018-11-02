module.exports = function(sequelize, DataTypes) {
  const order_menu = sequelize.define(
    "order_menu",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      ORDERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      SALEID: { type: DataTypes.INTEGER.UNSIGNED },

      MENUID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      COUNT: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      PRICE: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
    },
    {
      timestamps: false,
      tableName: "order_menu",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  order_menu.associate = models => {
    order_menu.belongsTo(models.order, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order_menu.belongsTo(models.shop_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "MENUID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order_menu.belongsTo(models.sale, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SALEID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order_menu.hasMany(models.order_menu_option, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERMENUID",
        allowNull: false
      },
      sourceKey: "_id"
    });
  };

  return order_menu;
};
