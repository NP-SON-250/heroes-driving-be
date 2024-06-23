import PaymentNotifierModel from "../models/paymentNotify.models";
export const allNotifications = async (req, res) => {
  try {
    const allData = await PaymentNotifierModel.find();
    return res.status(200).json({
        status:"200",
        message: "All notifications",
        data: allData,
    })
  } catch (error) {
    console.error("Error retrieving notifications:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve notifications",
      error: error.message,
    });
  }
};
