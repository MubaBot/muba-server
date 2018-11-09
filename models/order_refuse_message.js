module.exports = function(sequelize, DataTypes) {
  const order_refuse_message = sequelize.define(
    "order_refuse_message",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      SHOPID: { type: DataTypes.INTEGER.UNSIGNED, notNull: true },

      NAME: { type: DataTypes.STRING, notNull: true },
      MESSAGE: { type: DataTypes.STRING, notNull: true }
    },
    {
      timestamps: true,
      tableName: "order_refuse_message",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  order_refuse_message.associate = models => {
    order_refuse_message.belongsTo(models.shop, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      targetKey: "_id"
    });

    order_refuse_message.hasMany(models.order, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "ADMISSIONID",
        allowNull: true
      },
      sourceKey: "_id"
    });
  };

  return order_refuse_message;
};
