export interface IReceiptRes {
  _id: string;
  notificationId: {
    title: string;
    message: string;
    category: string;
    createdBy: {
      name: string;
    };

    status: "draft" | "send";
  };
  deliveredAt: string;
  isRead: boolean;
}
