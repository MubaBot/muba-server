module.exports = function(sequelize, DataTypes) {
  const order = sequelize.define(
    "order",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      USERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },

      ADDRESS: { type: DataTypes.STRING, notNull: true },
      REQUIRE: { type: DataTypes.STRING },
      PHONE: { type: DataTypes.STRING, notNull: true },
      PRICE: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },

      ADMISSION: { type: DataTypes.BOOLEAN }
    },
    {
      timestamps: true,
      tableName: "order",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  order.associate = models => {
    order.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order.belongsTo(models.user, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "USERID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order.hasMany(models.order_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    order.hasMany(models.order_push, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERID",
        allowNull: false
      },
      sourceKey: "_id"
    });
  };

  return order;
};
