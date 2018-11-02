module.exports = function(sequelize, DataTypes) {
  const sale = sequelize.define(
    "sale",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      MENUID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },

      LIMIT: { type: DataTypes.INTEGER, defaultValue: 0 },
      COUNT: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },

      PRICE: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },

      USEDATE: { type: DataTypes.BOOLEAN, defaultValue: false },
      STARTDAY: { type: DataTypes.INTEGER.UNSIGNED },
      ENDDAY: { type: DataTypes.INTEGER.UNSIGNED },

      USETIME: { type: DataTypes.BOOLEAN, defaultValue: false },
      STARTTIME: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      ENDTIME: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
    },
    {
      timestamps: false,
      tableName: "sale",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  sale.associate = models => {
    sale.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    sale.belongsTo(models.shop_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "MENUID",
        allowNull: false
      },
      targetKey: "_id"
    });

    sale.hasMany(models.order_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SALEID",
        allowNull: true
      },
      sourceKey: "_id"
    });
  };

  return sale;
};
