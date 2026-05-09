import Tag from "@/models/Tag";
import { createTagSchema, updateTagSchema } from "@/lib/validators/tag.validator";

/**
 * Create a new tag
 * @param data
 */
export async function createTag(data: any) {
  const validated = createTagSchema.safeParse(data);
  if (!validated.success) {
    throw { status: 400, errors: validated.error.flatten().fieldErrors };
  }

  // Make sure slug is unique
  const exists = await Tag.findOne({ slug: validated.data.slug });
  if (exists) {
    throw { status: 409, message: "تگ با این اسلاگ قبلاً ثبت شده است" };
  }

  const tag = await Tag.create(validated.data);
  return tag;
}

/**
 * Update an existing tag by id or slug
 * @param id
 * @param data
 */
export async function updateTag(id: string, data: any) {
  const validated = updateTagSchema.safeParse(data);
  if (!validated.success) {
    throw { status: 400, errors: validated.error.flatten().fieldErrors };
  }

  let tag;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    tag = await Tag.findById(id);
  }
  if (!tag) {
    tag = await Tag.findOne({ slug: id });
  }
  if (!tag) {
    throw { status: 404, message: "تگ مورد نظر یافت نشد" };
  }

  // If slug is being updated, check for duplicate
  if (validated.data.slug && validated.data.slug !== tag.slug) {
    const slugExists = await Tag.findOne({ slug: validated.data.slug });
    if (slugExists) {
      throw { status: 409, message: "تگ با این اسلاگ قبلاً ثبت شده است" };
    }
  }

  Object.assign(tag, validated.data);

  await tag.save();
  return tag;
}

/**
 * Delete a tag by id or slug
 * @param id
 */
export async function deleteTag(id: string) {
  let tag;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    tag = await Tag.findById(id);
  }
  if (!tag) {
    tag = await Tag.findOne({ slug: id });
  }
  if (!tag) {
    throw { status: 404, message: "تگ مورد نظر یافت نشد" };
  }
  await tag.deleteOne();
  return true;
}

/**
 * Get one tag (by id or slug)
 * @param id
 */
export async function getTag(id: string) {
  let tag;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    tag = await Tag.findById(id);
  }
  if (!tag) {
    tag = await Tag.findOne({ slug: id });
  }
  if (!tag) {
    throw { status: 404, message: "تگ مورد نظر یافت نشد" };
  }
  return tag;
}

/**
 * Get all tags with pagination
 * @param page
 * @param limit
 */
export async function getTags({ page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [tags, total] = await Promise.all([
    Tag.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Tag.countDocuments(),
  ]);
  return {
    tags,
    total,
    page,
    pageSize: limit,
    pageCount: Math.ceil(total / limit),
  };
}