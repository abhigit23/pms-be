import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectNIT = sequelize.define("noticeInvitingTendor", {
	nit_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	// tendorTitle: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// },

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

	nitDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},

	// openTendorDate: {
	// 	type: DataTypes.DATE,
	// 	allowNull: false,
	// },

	// openTendorTime: {
	// 	type: DataTypes.TIME,
	// 	allowNull: false,
	// },

	nitNumber: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
});
