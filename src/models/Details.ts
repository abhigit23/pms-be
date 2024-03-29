import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

export const ProjectDetails = sequelize.define("projectDetails", {
	project_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},

	projectTitle: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			len: {
				msg: "Title shouldn't be less than 5 words and not more than 20 words",
				args: [5, 100],
			},
		},
	},

	projectStatus: {
		type: DataTypes.ENUM,
		allowNull: false,
		values: ["work-in-progress", "pre-contractual", "cancelled"],
	},
});
