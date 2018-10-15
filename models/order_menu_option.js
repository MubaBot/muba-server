module.exports = function(sequelize, DataTypes) {
  const order_menu_option = sequelize.define(
    "order_menu_option",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      ORDERMENUID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      OPTIONID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true }
    },
    {
      timestamps: false,
      tableName: "order_menu_option",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  order_menu_option.associate = models => {
    order_menu_option.belongsTo(models.order_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERMENUID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order_menu_option.belongsTo(models.shop_menu_options, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "OPTIONID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return order_menu_option;
};
