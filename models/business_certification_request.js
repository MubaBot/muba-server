module.exports = function(sequelize, DataTypes) {
  const business_certification_request = sequelize.define(
    "business_certification_request",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      OWNERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      NUMBER: { type: DataTypes.STRING, unique: true, notNull: true },
      USERNAME: { type: DataTypes.STRING, notNull: true },
      URL: { type: DataTypes.STRING, unique: true, notNull: true }
    },
    {
      timestamps: false,
      tableName: "business_certification_request",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  business_certification_request.associate = models => {
    business_certification_request.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    business_certification_request.belongsTo(models.owner, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "OWNERID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return business_certification_request;
};
