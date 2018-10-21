module.exports = function(sequelize, DataTypes) {
  const shop = sequelize.define(
    "shop",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      OWNERID: { type: DataTypes.INTEGER.UNSIGNED },
      SHOPNAME: { type: DataTypes.STRING, notNull: true },
      PHONE: { type: DataTypes.STRING },
      HOMEPAGE: { type: DataTypes.STRING }
    },
    {
      timestamps: true,
      tableName: "shop",
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  shop.associate = models => {
    shop.hasOne(models.business_certification, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasOne(models.business_certification_request, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasOne(models.shop_address, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasOne(models.shop_crawler, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.business_certification_request_log, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.shop_time, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.shop_menu, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.shop_options, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.shop_menu_options, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.sale, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.order, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.order_push, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.belongsTo(models.owner, {
      foreignKey: {
        name: "OWNERID",
        allowNull: true
      },
      targetKey: "_id"
    });
  };

  return shop;
};
