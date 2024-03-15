import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectTechnicalBid = sequelize.define("technicalBid", {
	tBid_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	tBidDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},

	// ownerName: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// 	validate: {
	// 		len: {
	// 			msg: "Name shouldn't be less than 3 words and not more than 30 words",
	// 			args: [3, 30],
	// 		},
	// 	},
	// },

	// ownerAddress: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// },

	// ownerPhone: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// 	validate: {
	// 		customValidator(value: string) {
	// 			if (!validator.isMobilePhone(value, "en-IN")) {
	// 				throw new BadRequestError("Please provide a valid phone number!");
	// 			}
	// 		},
	// 	},
	// },

	// propertyAddress: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// },

	// leasedOrFreeHold: {
	// 	type: DataTypes.ENUM,
	// 	values: ["leased", "freeHold"],
	// 	allowNull: false,
	// },
});
