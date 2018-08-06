module.exports = function (sequelize, DataTypes) {
  const admin = sequelize.define('admin', {
    _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    ID: { type: DataTypes.STRING, unique: true, notNull: true },
    USERNAME: { type: DataTypes.STRING, notNull: true },
    EMAIL: { type: DataTypes.STRING, unique: true, notNull: true },
    PASSWORD: { type: DataTypes.STRING, notNull: true },
    BLOCK: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    timestamps: false,
    tableName: 'admin'
  });

  return admin;
};