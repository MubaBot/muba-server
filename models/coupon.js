module.exports = function (sequelize, DataTypes) {
  const coupon = sequelize.define('coupon', {
    COUPON_ID: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    COUPON_NUMBER: { type: DataTypes.STRING, unique: true, notNull: true },
    COUPON_MAXCOUNT: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
    COUPON_EXPIRE: { type: DataTypes.DATE, notNull: true },
    COUPON_SERVICE_DATE: { type: DataTypes.DATE, notNull: true },
  }, {
    timestamps: false,
    tableName: 'coupon'
  });

  return coupon;
};