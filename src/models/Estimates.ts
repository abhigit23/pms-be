import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectEstimates = sequelize.define("estimate", {
	estimate_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	estimateDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},

	// itemDescription: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// 	validate: {
	// 		len: {
	// 			msg: "Description shouldn't be less than 10 words and not more than 30 words",
	// 			args: [10, 30],
	// 		},
	// 	},
	// },

	estimateNumber: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},

	estimateAmount: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},

	// totalCost: {
	// 	type: DataTypes.INTEGER,
	// 	allowNull: false,
	// },
});
