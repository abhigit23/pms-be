import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectWorkOrder = sequelize.define("workOrder", {
	workOrder_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	workOrderNumber: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},

	workOrderDate: {
		type: DataTypes.DATE,
		allowNull: false,
	},

	tendorCost: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},

	projectFileNumber: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},

	projectFileDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},

	scheduledStartDate: {
		type: DataTypes.DATE,
		allowNull: false,
	},

	scheduledEndDate: {
		type: DataTypes.DATE,
		allowNull: false,
	},

	likelyCompletionDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});
