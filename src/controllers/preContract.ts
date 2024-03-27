import type { Request, Response } from "express";
import { where } from "sequelize";
import BadRequestError from "../errors/badRequest";
import { ProjectDetails } from "../models/Details";
import { ProjectEstimates } from "../models/Estimates";
import { ProjectFeasibility } from "../models/Feasibility";
import { ProjectNIT } from "../models/NIT";
import { ProjectRequisition } from "../models/Requisition";
import { ProjectSanction } from "../models/Sanction";
import { ProjectTechnicalBid } from "../models/TechnicalBid";
import { ProjectWorkOrder } from "../models/WorkOrder";

interface UploadedFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	destination: string;
	filename: string;
	path: string;
	size: number;
}

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

	const requisition = await ProjectRequisition.create({
		project_id: projectDetails.project_id,
		requestedBy,
		requisitionDate,
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
		requisition,
		feasibility,
		estimates,
		sanction,
		nit,
		technicalBid,
		msg: "Project Added Successfully!",
	});
};

export const getAllProjects = async (req: Request, res: Response) => {
	const details = await ProjectDetails.findAll({
		include: [
			{
				model: ProjectRequisition,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
			{
				model: ProjectFeasibility,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
			{
				model: ProjectEstimates,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
			{
				model: ProjectSanction,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
			{
				model: ProjectNIT,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
			{
				model: ProjectTechnicalBid,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
			{
				model: ProjectWorkOrder,
				attributes: { exclude: ["createdAt", "updatedAt", "project_id"] },
			},
		],
		raw: true,
	});
	if (details.length === 0) {
		throw new BadRequestError("Currently there are no projects added!");
	}
	const formattedProjects = details.map((project: any) => {
		const {
			project_id,
			projectTitle,
			projectStatus,
			createdAt,
			updatedAt,
			"requisition.requestedBy": requestedBy,
			"requisition.requisitionDate": requisitionDate,
			"feasibility.documents": documents,
			"feasibility.feasibilityStatus": feasibilityStatus,
			"feasibility.feasibilityDate": feasibilityDate,
			"estimate.estimateDate": estimateDate,
			"estimate.estimateNumber": estimateNumber,
			"estimate.estimateAmount": estimateAmount,
			"sanction.sanctionDate": sanctionDate,
			"sanction.sanctionNumber": sanctionNumber,
			"sanction.sanctionAmount": sanctionAmount,
			"noticeInvitingTendor.nitDate": nitDate,
			"noticeInvitingTendor.nitNumber": nitNumber,
			"technicalBid.tBidDate": tBidDate,
			"workOrder.workOrderNumber": workOrderNumber,
			"workOrder.workOrderDate": workOrderDate,
			"workOrder.tendorCost": tendorCost,
			"workOrder.projectFileNumber": projectFileNumber,
			"workOrder.projectFileDate": projectFileDate,
			"workOrder.scheduledStartDate": scheduledStartDate,
			"workOrder.scheduledEndDate": scheduledEndDate,
			"workOrder.projectWorkType": projectWorkType,
			"workOrder.projectType": projectType,
		} = project;

		return {
			project_id,
			projectTitle,
			projectStatus,
			requestedBy,
			requisitionDate,
			documents,
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
			workOrderDate,
			projectWorkType,
			projectType,
			workOrderNumber,
			tendorCost,
			projectFileNumber,
			projectFileDate,
			scheduledStartDate,
			scheduledEndDate,
			createdAt,
			updatedAt,
		};
	});

	res.status(200).json(formattedProjects);
};

export const getSingleProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const details: any = await ProjectDetails.findAll({
		where: {
			project_id: projectId,
		},
		raw: true,
	});

	if (details.length === 0) {
		throw new BadRequestError(`No project found with projectId: ${projectId}`);
	}

	const requisition: any = await ProjectRequisition.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["requisiton_id"] },
		raw: true,
	});

	const feasibility: any = await ProjectFeasibility.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["feasibility_id"] },
		raw: true,
	});
	const estimate: any = await ProjectEstimates.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["estimate_id"] },
		raw: true,
	});
	const sanction: any = await ProjectSanction.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["sanction_id"] },
		raw: true,
	});
	const nit: any = await ProjectNIT.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["nit_id"] },
		raw: true,
	});
	const technicalBid: any = await ProjectTechnicalBid.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["tBid_id"] },
		raw: true,
	});
	const workOrder: any = await ProjectWorkOrder.findAll({
		where: {
			project_id: projectId,
		},
		attributes: { exclude: ["workOrder_id"] },
		raw: true,
	});

	res.status(200).json({
		...details[0],
		...requisition[0],
		...feasibility[0],
		...estimate[0],
		...sanction[0],
		...nit[0],
		...technicalBid[0],
		...workOrder[0],
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
		workOrderNumber,
		workOrderDate,
		tendorCost,
		projectFileNumber,
		projectFileDate,
		projectType,
		projectWorkType,
		scheduledStartDate,
		scheduledEndDate,
	} = req.body;

	if (
		!projectTitle ||
		!projectStatus ||
		!estimateAmount ||
		!sanctionAmount ||
		!tendorCost
	) {
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

	// for Work Order
	if (!workOrderDate && !workOrderNumber) rightFilled = true;
	if (workOrderDate && workOrderNumber) rightFilled = true;
	if (workOrderDate && !workOrderNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Work Order Date and Number) fields or leave them empty",
		);
	}

	if (!workOrderDate && workOrderNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Work Order Date and Number) fields or leave them empty",
		);
	}

	if (!projectFileDate && !projectFileNumber) rightFilled = true;
	if (projectFileDate && projectFileNumber) rightFilled = true;
	if (projectFileDate && !projectFileNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Project File Date and Number) fields or leave them empty",
		);
	}
	if (!projectFileDate && projectFileNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Project File Date and Number) fields or leave them empty",
		);
	}

	if (!scheduledStartDate && !scheduledEndDate) rightFilled = true;
	if (scheduledStartDate && scheduledEndDate) rightFilled = true;
	if (scheduledStartDate && !scheduledEndDate) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Scheduled Start and End Date) fields or leave them empty",
		);
	}
	if (!scheduledStartDate && scheduledEndDate) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Scheduled Start and End Date) fields or leave them empty",
		);
	}

	if (sanctionAmount > estimateAmount) {
		throw new BadRequestError(
			"Sanctioned Amount should not be greater than Estimated Amount",
		);
	}

	if (tendorCost > sanctionAmount) {
		throw new BadRequestError(
			"Tendor cost should not be greater than Sanction Amount",
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

	await ProjectRequisition.update(
		{
			requestedBy,
			requisitionDate,
		},
		{
			where: { project_id: projectId },
		},
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

	const findWorkOrder = await ProjectWorkOrder.findAll({
		where: {
			project_id: projectId,
		},
	});

	if (findWorkOrder.length === 0) {
		await ProjectWorkOrder.create({
			project_id: projectId,
			workOrderNumber,
			workOrderDate,
			tendorCost,
			projectFileNumber,
			projectFileDate,
			projectType,
			scheduledStartDate,
			scheduledEndDate,
		});
	} else {
		await ProjectWorkOrder.update(
			{
				project_id: projectId,
				workOrderNumber,
				workOrderDate,
				tendorCost,
				projectFileNumber,
				projectFileDate,
				projectType,
				scheduledStartDate,
				scheduledEndDate,
			},
			{ where: { project_id: projectId } },
		);
	}

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

export const uploadDocs = async (
	req: Request & { files: UploadedFile[] },
	res: Response,
) => {
	const urls = req.files.map(
		(file) => `${process.env.BACKEND_URL}/${file.path}`,
	);
	const details = await ProjectFeasibility.create({ documents: { urls } });
	res.status(200).json(details);
};
