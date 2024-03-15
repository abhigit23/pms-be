import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectRequisition = sequelize.define("requisition", {
	requisition_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	requisitionDate: {
		type: DataTypes.DATE,
		allowNull: false,
	},

	requestedBy: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	// projectAmount: {
	// 	type: DataTypes.INTEGER,
	// 	allowNull: false,
	// },
});
