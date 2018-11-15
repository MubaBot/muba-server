module.exports = function(sequelize, DataTypes) {
  const user = sequelize.define(
    "user",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      ID: { type: DataTypes.STRING, unique: true, notNull: true },
      USERNAME: { type: DataTypes.STRING, notNull: true },
      EMAIL: { type: DataTypes.STRING, unique: true, notNull: true },
      PASSWORD: { type: DataTypes.STRING, notNull: true },
      BLOCK: { type: DataTypes.BOOLEAN, defaultValue: false },
      PHONE: { type: DataTypes.STRING },
      GENDER: { type: DataTypes.STRING },
      BIRTH: { type: DataTypes.INTEGER.UNSIGNED }
    },
    {
      timestamps: true,
      tableName: "user",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  user.associate = models => {
    user.hasMany(models.user_address, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "USERID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    user.hasMany(models.review, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "USERID",
        allowNull: false
      },
      sourceKey: "_id"
    });
  };

  return user;
};
