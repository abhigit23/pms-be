import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectSanction = sequelize.define("sanction", {
	sanction_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	sanctionDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},

	sanctionNumber: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},

	sanctionAmount: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});
