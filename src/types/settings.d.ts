declare type TSiteSettings = {
  _id?: string;
  key?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowComments: boolean;
  allowRegistration: boolean;
  postsPerPage: number;
  notifyNewContact: boolean;
  notifyNewComment: boolean;
  createdAt?: string;
  updatedAt?: string;
};

declare type TSettingsResponse = {
  message: string;
  data: TSiteSettings;
};
