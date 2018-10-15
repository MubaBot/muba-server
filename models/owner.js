module.exports = function(sequelize, DataTypes) {
  const owner = sequelize.define(
    "owner",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      ID: { type: DataTypes.STRING, unique: true, notNull: true },
      USERNAME: { type: DataTypes.STRING, notNull: true },
      EMAIL: { type: DataTypes.STRING, unique: true, notNull: true },
      PASSWORD: { type: DataTypes.STRING, notNull: true },
      BLOCK: { type: DataTypes.BOOLEAN, defaultValue: false },
      PHONE: { type: DataTypes.STRING, defaultValue: false }
    },
    {
      timestamps: true,
      tableName: "owner",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  owner.associate = models => {
    owner.hasMany(models.shop, {
      foreignKey: {
        name: "OWNERID",
        allowNull: true
      },
      sourceKey: "_id"
    });

    owner.hasMany(models.business_certification, {
      foreignKey: {
        name: "OWNERID",
        allowNull: true
      },
      constraints: false,
      sourceKey: "_id"
    });

    owner.hasMany(models.business_certification_request, {
      foreignKey: {
        name: "OWNERID",
        allowNull: true
      },
      constraints: false,
      sourceKey: "_id"
    });

    owner.hasMany(models.business_certification_request_log, {
      foreignKey: {
        name: "OWNERID",
        allowNull: true
      },
      constraints: false,
      sourceKey: "_id"
    });
  };

  return owner;
};
