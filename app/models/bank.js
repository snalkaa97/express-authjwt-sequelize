"use strict";
const { Model } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");
module.exports = (sequelize, DataTypes) => {
	class Bank extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Bank.init(
		{
			name: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Bank",
		}
	);
	sequelizePaginate.paginate(Bank);
	return Bank;
};
