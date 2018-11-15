module.exports = function(sequelize, DataTypes) {
  const review = sequelize.define(
    "review",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      USERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      ORDERID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },

      POINT: { type: DataTypes.INTEGER.UNSIGNED, min: 0, max: 5, notNull: true },
      TEXT: { type: DataTypes.TEXT, notNull: true }
    },
    {
      timestamps: true,
      tableName: "review",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  review.associate = models => {
    review.hasMany(models.review_photo, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "REVIEWID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    review.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    review.belongsTo(models.user, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "USERID",
        allowNull: false
      },
      targetKey: "_id"
    });

    review.belongsTo(models.order, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ORDERID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return review;
};
