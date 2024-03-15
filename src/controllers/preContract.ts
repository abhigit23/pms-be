import type { Request, Response } from "express";
import BadRequestError from "../errors/badRequest";
import { ProjectDetails } from "../models/Details";
import { ProjectEstimates } from "../models/Estimates";
import { ProjectFeasibility } from "../models/Feasibility";
import { ProjectNIT } from "../models/NIT";
import { ProjectSanction } from "../models/Sanction";
import { ProjectTechnicalBid } from "../models/TechnicalBid";
import { ProjectWorkOrder } from "../models/WorkOrder";

export const addPreContractDetails = async (req: Request, res: Response) => {
	const {
		projectTitle,
		projectStatus,
		requisitionDate,
		requestedBy,
		feasibilityStatus,
		feasibilityDate,
		estimateDate,
		estimateNumber,
		estimateAmount,
		sanctionDate,
		sanctionNumber,
		sanctionAmount,
		nitDate,
		nitNumber,
		tBidDate,
	} = req.body;

	if (!projectTitle || !projectStatus || !estimateAmount || !sanctionAmount) {
		throw new BadRequestError("Please fill all the mandatory details!");
	}

	let rightFilled = true;

	// for Requisition
	if (!requisitionDate && !requestedBy) rightFilled = true;
	if (requisitionDate && requestedBy) rightFilled = true;
	if (requisitionDate && !requestedBy) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Requisition Date and Number) fields or leave them empty",
		);
	}
	if (!requisitionDate && requestedBy) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Requisition Date and Number) fields or leave them empty",
		);
	}

	// for Feasibility

	if (!feasibilityDate && !feasibilityStatus) rightFilled = true;
	if (feasibilityDate && feasibilityStatus) rightFilled = true;
	if (feasibilityDate && !feasibilityStatus) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Feasibility Date and Status) fields or leave them empty",
		);
	}
	if (!feasibilityDate && feasibilityStatus) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Feasibility Date and Status) fields or leave them empty",
		);
	}

	// for Sanction
	if (!sanctionDate && !sanctionNumber) rightFilled = true;
	if (sanctionDate && sanctionNumber) rightFilled = true;
	if (sanctionDate && !sanctionNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Sanction Date and Number) fields or leave them empty",
		);
	}
	if (!sanctionDate && sanctionNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Sanction Date and Number) fields or leave them empty",
		);
	}

	// for NIT
	if (!nitDate && !nitNumber) rightFilled = true;
	if (nitDate && nitNumber) rightFilled = true;
	if (nitDate && !nitNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (NIT Date and Number) fields or leave them empty",
		);
	}
	if (!nitDate && nitNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (NIT Date and Number) fields or leave them empty",
		);
	}

	// for Estimate
	if (!estimateDate && !estimateNumber) rightFilled = true;
	if (estimateDate && estimateNumber) rightFilled = true;
	if (estimateDate && !estimateNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Estimate Date and Number) fields or leave them empty",
		);
	}
	if (!estimateDate && estimateNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Estimate Date and Number) fields or leave them empty",
		);
	}

	if (sanctionAmount > estimateAmount) {
		throw new BadRequestError(
			"Sanctioned Amount should not be greater than Estimated Amount",
		);
	}

	if (!rightFilled)
		throw new BadRequestError("Please fill the fields correctly!");

	const projectDetails: any = await ProjectDetails.create({
		projectTitle,
		projectStatus,
	});

	const feasibility = await ProjectFeasibility.create({
		project_id: projectDetails.project_id,
		feasibilityDate,
		feasibilityStatus,
	});

	const estimates = await ProjectEstimates.create({
		project_id: projectDetails.project_id,
		estimateDate,
		estimateNumber,
		estimateAmount,
	});

	const sanction = await ProjectSanction.create({
		project_id: projectDetails.project_id,
		sanctionDate,
		sanctionNumber,
		sanctionAmount,
	});

	const nit = await ProjectNIT.create({
		project_id: projectDetails.project_id,
		nitDate,
		nitNumber,
	});

	const technicalBid = await ProjectTechnicalBid.create({
		project_id: projectDetails.project_id,
		tBidDate,
	});

	res.status(201).json({
		projectDetails,
		feasibility,
		estimates,
		sanction,
		nit,
		technicalBid,
	});
};

export const getAllProjects = async (req: Request, res: Response) => {
	const details = await ProjectDetails.findAll();
	if (details.length === 0) {
		throw new BadRequestError("Currently there are no projects added!");
	}
	const feasibility = await ProjectFeasibility.findAll();
	const estimate = await ProjectEstimates.findAll();
	const sanction = await ProjectSanction.findAll();
	const nit = await ProjectNIT.findAll();
	const technicalBid = await ProjectTechnicalBid.findAll();
	const workOrder = await ProjectWorkOrder.findAll();

	res.status(200).json({
		details,
		feasibility,
		estimate,
		sanction,
		nit,
		technicalBid,
		workOrder,
	});
};

export const getSingleProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const details = await ProjectDetails.findAll({
		where: {
			project_id: projectId,
		},
	});

	if (details.length === 0) {
		throw new BadRequestError(`No project found with projectId: ${projectId}`);
	}

	const feasibility = await ProjectFeasibility.findAll({
		where: {
			project_id: projectId,
		},
	});
	const estimate = await ProjectEstimates.findAll({
		where: {
			project_id: projectId,
		},
	});
	const sanction = await ProjectSanction.findAll({
		where: {
			project_id: projectId,
		},
	});
	const nit = await ProjectNIT.findAll({
		where: {
			project_id: projectId,
		},
	});
	const technicalBid = await ProjectTechnicalBid.findAll({
		where: {
			project_id: projectId,
		},
	});
	const workOrder = await ProjectWorkOrder.findAll({
		where: {
			project_id: projectId,
		},
	});

	res.status(200).json({
		details,
		feasibility,
		estimate,
		sanction,
		nit,
		technicalBid,
		workOrder,
	});
};

export const updateProjectDetails = async (req: Request, res: Response) => {
	const {
		projectId,
		projectTitle,
		projectStatus,
		requisitionDate,
		requestedBy,
		feasibilityDate,
		feasibilityStatus,
		estimateDate,
		estimateNumber,
		estimateAmount,
		sanctionDate,
		sanctionNumber,
		sanctionAmount,
		nitDate,
		nitNumber,
		tBidDate,
	} = req.body;

	if (!projectTitle || !projectStatus || !estimateAmount || !sanctionAmount) {
		throw new BadRequestError("Please fill all the mandatory details!");
	}

	let rightFilled = true;

	// for Requisition
	if (!requisitionDate && !requestedBy) rightFilled = true;
	if (requisitionDate && requestedBy) rightFilled = true;
	if (requisitionDate && !requestedBy) {
		rightFilled = false;
		throw new BadRequestError("Either fill both fields or leave them empty");
	}
	if (!requisitionDate && requestedBy) {
		rightFilled = false;
		throw new BadRequestError("Either fill both fields or leave them empty");
	}

	// for Feasibility

	if (!feasibilityDate && !feasibilityStatus) rightFilled = true;
	if (feasibilityDate && feasibilityStatus) rightFilled = true;
	if (feasibilityDate && !feasibilityStatus) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Feasibility Date and Status) fields or leave them empty",
		);
	}
	if (!feasibilityDate && feasibilityStatus) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Feasibility Date and Status) fields or leave them empty",
		);
	}

	// for Sanction
	if (!sanctionDate && !sanctionNumber) rightFilled = true;
	if (sanctionDate && sanctionNumber) rightFilled = true;
	if (sanctionDate && !sanctionNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Sanction Date and Number) fields or leave them empty",
		);
	}
	if (!sanctionDate && sanctionNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Sanction Date and Number) fields or leave them empty",
		);
	}

	// for NIT
	if (!nitDate && !nitNumber) rightFilled = true;
	if (nitDate && nitNumber) rightFilled = true;
	if (nitDate && !nitNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (NIT Date and Number) fields or leave them empty",
		);
	}
	if (!nitDate && nitNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (NIT Date and Number) fields or leave them empty",
		);
	}

	// for Estimate
	if (!estimateDate && !estimateNumber) rightFilled = true;
	if (estimateDate && estimateNumber) rightFilled = true;
	if (estimateDate && !estimateNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Estimate Date and Number) fields or leave them empty",
		);
	}
	if (!estimateDate && estimateNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Estimate Date and Number) fields or leave them empty",
		);
	}

	if (sanctionAmount > estimateAmount) {
		throw new BadRequestError(
			"Sanctioned Amount should not be greater than Estimated Amount",
		);
	}

	if (!rightFilled)
		throw new BadRequestError("Please fill the fields correctly!");

	const findProject = await ProjectDetails.findAll({
		where: {
			project_id: projectId,
		},
	});
	if (findProject.length === 0) {
		throw new BadRequestError(
			`No project found to edit with projectId ${projectId}`,
		);
	}

	await ProjectDetails.update(
		{
			projectTitle,
			projectStatus,
		},
		{ where: { project_id: projectId } },
	);
	await ProjectFeasibility.update(
		{
			feasibilityDate,
			feasibilityStatus,
		},
		{ where: { project_id: projectId } },
	);

	await ProjectEstimates.update(
		{
			estimateDate,
			estimateNumber,
			estimateAmount,
		},
		{ where: { project_id: projectId } },
	);

	await ProjectSanction.update(
		{
			sanctionDate,
			sanctionNumber,
			sanctionAmount,
		},
		{ where: { project_id: projectId } },
	);

	await ProjectNIT.update(
		{
			nitDate,
			nitNumber,
		},
		{ where: { project_id: projectId } },
	);

	await ProjectTechnicalBid.update(
		{
			tBidDate,
		},
		{ where: { project_id: projectId } },
	);

	res.status(200).json({
		msg: "Project updated successfully!",
	});
};

export const deleteProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;

	const findProject = await ProjectDetails.findAll({
		where: {
			project_id: projectId,
		},
	});

	if (findProject.length === 0) {
		throw new BadRequestError(
			`No project found to edit with projectId ${projectId}`,
		);
	}

	await ProjectDetails.destroy({
		where: {
			project_id: projectId,
		},
	});

	res.status(200).json({ msg: "Project deleted successfully!" });
};