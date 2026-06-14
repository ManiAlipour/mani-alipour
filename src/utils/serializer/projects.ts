export const serializeProject = (project: any) => ({
  ...project,
  _id: project._id?.toString(),
  createdAt: project.createdAt?.toISOString?.() ?? project.createdAt,
  updatedAt: project.updatedAt?.toISOString?.() ?? project.updatedAt,
});
