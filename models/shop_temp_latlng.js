module.exports = function(sequelize, DataTypes) {
  const shop_temp_latlng = sequelize.define(
    "shop_temp_latlng",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: {
        type: DataTypes.INTEGER.UNSIGNED,
        notNull: true,
        references: {
          model: "shop",
          key: "_id"
        }
      },
      USERID: {
        type: DataTypes.INTEGER.UNSIGNED,
        notNull: true,
        references: {
          model: "user",
          key: "_id"
        }
      },
      ADDRLAT: { type: DataTypes.DOUBLE, notNull: true },
      ADDRLNG: { type: DataTypes.DOUBLE, notNull: true }
    },
    {
      timestamps: false,
      tableName: "shop_temp_latlng",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  return shop_temp_latlng;
};
