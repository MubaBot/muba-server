module.exports = function(sequelize, DataTypes) {
  const order_push = sequelize.define(
    "order_push",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      ORDERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true }
    },
    {
      timestamps: true,
      tableName: "order_push",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  order_push.associate = models => {
    order_push.belongsTo(models.order, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order_push.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return order_push;
};
