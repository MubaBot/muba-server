const moment = require("moment");

module.exports = function(sequelize, DataTypes) {
  const shop = sequelize.define(
    "shop",
    {
      _id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      OWNERID: { type: DataTypes.INTEGER.UNSIGNED },
      OPEN: { type: DataTypes.BOOLEAN, defaultValue: false },
      DELIVERY: { type: DataTypes.BOOLEAN, defaultValue: false },
      URL: { type: DataTypes.STRING },
      SHOPNAME: { type: DataTypes.STRING, notNull: true },
      PHONE: { type: DataTypes.STRING },
      HOMEPAGE: { type: DataTypes.STRING },
      POINT: { type: DataTypes.DOUBLE, defaultValue: 0 },

      ADDRESS: { type: DataTypes.STRING, notNull: true },
      ADDRESSDETAIL: { type: DataTypes.STRING, notNull: true },
      ADDRLAT: { type: DataTypes.DOUBLE, defaultValue: 0 },
      ADDRLNG: { type: DataTypes.DOUBLE, defaultValue: 0 },
      ADMIN: { type: DataTypes.BOOLEAN, defaultValue: false }, // If true was address setting by admin.

      ENDDATE: {
        type: DataTypes.DATEONLY,
        defaultValue: () =>
          moment
            .utc()
            .subtract(1, "days")
            .toDate()
      }
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

    shop.hasMany(models.order_refuse_message, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.shop_service_request, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      foreignKey: {
        name: "SHOPID",
        allowNull: false
      },
      sourceKey: "_id"
    });

    shop.hasMany(models.review, {
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
