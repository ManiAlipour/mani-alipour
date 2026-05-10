import Contact from "@/models/Contact";

export type ContactStatus = "new" | "read" | "replied" | "archived";

interface IContactData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: ContactStatus;
}

// Create a new contact
export const createContact = async (data: IContactData) => {
  const contact = new Contact({
    ...data,
    status: data.status ?? "new",
  });
  return await contact.save();
};

// Get a list of contacts with optional filters, pagination, and sorting
export const getContacts = async ({
  filter = {},
  limit = 20,
  offset = 0,
  sort = { createdAt: -1 },
}: {
  filter?: Partial<IContactData>;
  limit?: number;
  offset?: number;
  sort?: any;
} = {}) => {
  const contacts = await Contact.find(filter)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .exec();

  const total = await Contact.countDocuments(filter);

  return { contacts, total };
};

// Get a single contact by ID
export const getContactById = async (id: string) => {
  return await Contact.findById(id);
};

// Update a contact by ID
export const updateContact = async (id: string, update: Partial<IContactData>) => {
  return await Contact.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true }
  );
};

// Delete a contact by ID
export const deleteContact = async (id: string) => {
  return await Contact.findByIdAndDelete(id);
};
