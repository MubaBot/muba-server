module.exports = function(sequelize, DataTypes) {
  const review_photo = sequelize.define(
    "review_photo",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      REVIEWID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },
      URL: { type: DataTypes.STRING, notNull: true }
    },
    {
      timestamps: true,
      tableName: "review_photo",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  review_photo.associate = models => {
    review_photo.belongsTo(models.review, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "REVIEWID",
        allowNull: false
      },
      targetKey: "_id"
    });
  };

  return review_photo;
};
