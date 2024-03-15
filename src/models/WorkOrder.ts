import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectWorkOrder = sequelize.define("workOrder", {
	workOrder_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	// companyName: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// 	validate: {
	// 		len: {
	// 			msg: "Company name shouldn't be less than 5 words and not more than 20 words",
	// 			args: [5, 20],
	// 		},
	// 	},
	// },

	// website: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// },

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

	// expectedFinishDate: {
	// 	type: DataTypes.DATE,
	// 	allowNull: false,
	// },

	// assignedTo: {
	// 	type: DataTypes.JSON,
	// 	allowNull: false,
	// },
});
