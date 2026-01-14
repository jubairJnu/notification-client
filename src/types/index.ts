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
  title: string;
  message: string;
  category: string;
  deliveredAt: string;
  isRead: boolean;
}
