module.exports = function(sequelize, DataTypes) {
  const shop_address = sequelize.define(
    "shop_address",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, unique: true, notNull: true },
      ADDRESS: { type: DataTypes.STRING, notNull: true },
      ADDRESSDETAIL: { type: DataTypes.STRING, notNull: true },
      ADDRLAT: { type: DataTypes.DOUBLE, defaultValue: 0 },
      ADDRLNG: { type: DataTypes.DOUBLE, defaultValue: 0 },
      ADMIN: { type: DataTypes.BOOLEAN, defaultValue: false } // If true was setting by admin.
    },
    {
      timestamps: false,
      tableName: "shop_address",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop_address.associate = models => {
    shop_address.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return shop_address;
};
