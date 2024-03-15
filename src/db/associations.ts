import { ProjectDetails } from "../models/Details";
import { ProjectEstimates } from "../models/Estimates";
import { ProjectFeasibility } from "../models/Feasibility";
import { ProjectNIT } from "../models/NIT";
import { ProjectRequisition } from "../models/Requisition";
import { ProjectSanction } from "../models/Sanction";
import { ProjectTechnicalBid } from "../models/TechnicalBid";
import { ProjectWorkOrder } from "../models/WorkOrder";

function associations() {
	ProjectDetails.hasOne(ProjectRequisition, {
		foreignKey: "project_id",
	});

	ProjectDetails.hasOne(ProjectFeasibility, {
		foreignKey: "project_id",
		onDelete: "CASCADE",
	});

	ProjectDetails.hasOne(ProjectEstimates, {
		foreignKey: "project_id",
		onDelete: "CASCADE",
	});

	ProjectDetails.hasOne(ProjectSanction, {
		foreignKey: "project_id",
		onDelete: "CASCADE",
	});

	ProjectDetails.hasOne(ProjectNIT, {
		foreignKey: "project_id",
		onDelete: "CASCADE",
	});

	ProjectDetails.hasOne(ProjectTechnicalBid, {
		foreignKey: "project_id",
		onDelete: "CASCADE",
	});

	ProjectDetails.hasOne(ProjectWorkOrder, {
		foreignKey: "project_id",
		onDelete: "CASCADE",
	});
}

export default associations;
