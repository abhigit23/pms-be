import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectFeasibility = sequelize.define("feasibility", {
	feasibility_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	documents: {
		type: DataTypes.JSON,
		allowNull: true,
	},

	feasibilityStatus: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},

	feasibilityDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});
