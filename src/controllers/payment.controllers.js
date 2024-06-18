import axios from "axios";
import cron from "node-cron";
import PaymentModel from "../models/Payment.models";
import CategoryModel from "../models/category.models";
import userModel from "../models/users.models";

// Function to send SMS using Clickatell
const sendSMS = async (to, content) => {
  try {
    const clickatellApiUrl = "https://platform.clickatell.com/v1/message";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `${process.env.CLICKATELL_API_KEY}`,
    };

    const payload = {
      messages: [
        {
          channel: "sms",
          to: to,
          content: content,
        },
      ],
    };

    console.log("Sending SMS with payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(clickatellApiUrl, payload, { headers });
    console.log("SMS Response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Capture detailed error response
      console.error("Failed to send SMS:", error.response.data);
    } else {
      console.error("Failed to send SMS:", error.message);
    }
    throw error;
  }
};

// Function to generate a random code with a mixture of characters and numbers
const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Alphabetic characters
  const digits = "0123456789"; // Numeric digits

  let code = "";

  // Generate first part (e.g., A02c)
  for (let i = 0; i < 4; i++) {
    if (i === 0 || i === 2) {
      // Insert alphabetic characters
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      code += randomChar;
    } else {
      // Insert numeric digits
      const randomDigit = digits.charAt(
        Math.floor(Math.random() * digits.length)
      );
      code += randomDigit;
    }
  }

  // Insert dash
  code += "-";

  // Generate second part (e.g., G32v)
  for (let i = 0; i < 4; i++) {
    if (i === 1 || i === 3) {
      // Insert alphabetic characters
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      code += randomChar;
    } else {
      // Insert numeric digits
      const randomDigit = digits.charAt(
        Math.floor(Math.random() * digits.length)
      );
      code += randomDigit;
    }
  }

  return code;
};

// Recording user payment
export const userPayment = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.loggedInUser.id;
    const { phone } = req.body;
    const userInfo = await userModel.findById(userId);
    const userName = userInfo.fullname;

    if (!phone) {
      return res.status(400).json({
        status: "400",
        message: "Please provide a phone number for payment",
      });
    }

    const findCategory = await CategoryModel.findById(categoryId);
    if (!findCategory) {
      return res.status(404).json({
        status: "404",
        message: "Selected category not found",
      });
    }

    // Check if the user has already purchased this category
    if (findCategory.accessableBy.includes(userId)) {
      return res.status(400).json({
        status: "400",
        message: "You currently purchased this category and it is still active",
      });
    }

    const code = generateRandomCode(); // Generate the random code

    // Calculate expiry date and format it to 'YYYY-MM-DD'
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + findCategory.duration); // Calculate expiry date
    const formattedExpiredAt = expiredAt.toISOString().slice(0, 10); // Format to 'YYYY-MM-DD'

    const examNumber = findCategory.examsNumber;
    const paidAmount = findCategory.amount;
    const createPayment = await PaymentModel.create({
      paidBy: userId,
      paidCategory: categoryId,
      paidAmount: paidAmount,
      phone,
      code,
      expiredAt: formattedExpiredAt,
    });

    const smsMessage = `Hello, Dear ${userName} Hishyuwe, ${paidAmount} rwf kuri Heros College, uhawe bandle y'imyitozo: ${examNumber}, kode yawe ni: *${code}* Izarangira kuwa: ${formattedExpiredAt}. Uyibikeneza uzajya uyikenera.`;

    // Send SMS using Clickatell after payment recording
    const smsResponse = await sendSMS(phone, smsMessage);

    // Check if the message was not accepted and log detailed error
    const smsError = smsResponse.messages[0].error;
    if (smsError) {
      console.error("Failed to send SMS:", smsError);
    }
    await CategoryModel.findByIdAndUpdate(
      categoryId,
      { $push: { accessableBy: createPayment.paidBy } },
      { new: true }
    );
    return res.status(200).json({
      status: "200",
      message: "Payment recorded successfully",
      data: createPayment,
    });
  } catch (error) {
    console.error("Error saving payment:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to record payment",
      error: error.message,
    });
  }
};

// Function to update expireStatus of payments
const updateExpiredPayments = async () => {
  try {
    const currentDate = new Date();
    // Find payments where expiredAt date is less than the current date and expireStatus is still 'active'
    const expiredPayments = await PaymentModel.find({ expiredAt: { $lt: currentDate }, expireStatus: "active" });

    // Update expireStatus of found payments
    const updatePromises = expiredPayments.map(payment =>
      PaymentModel.findByIdAndUpdate(payment._id, { expireStatus: "expired" })
    );
    await Promise.all(updatePromises);

    // Collect userIds and categoryIds from expired payments
    const userIds = expiredPayments.map(payment => payment.paidBy);
    const categoryIds = expiredPayments.map(payment => payment.paidCategory);

    // Remove userIds from accessableBy array in the corresponding categories
    const updateCategoryPromises = categoryIds.map((categoryId, index) =>
      CategoryModel.findByIdAndUpdate(categoryId, { $pull: { accessableBy: userIds[index] } })
    );
    await Promise.all(updateCategoryPromises);

    console.log(`Updated ${expiredPayments.length} expired payments and removed access from categories.`);
  } catch (error) {
    console.error("Error updating expired payments:", error.message);
  }
};

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running cron job to update expired payments...");
  updateExpiredPayments();
});



// Display all payments

export const getAll = async (req, res) => {
  try {
    const getPayment = await PaymentModel.find();
    return res.status(200).json({
      status: "200",
      message: "All payments",
      data: getPayment,
    });
  } catch (error) {
    console.error("Error retrieving payments:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

export const getSingle = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const getOne = await PaymentModel.findById(paymentId);
    if (!getOne) {
      return res.status(404).json({
        status: "404",
        message: "Payment not found",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Single payment",
      data: getOne,
    });
  } catch (error) {
    console.error("Error retrieving payment:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve payment",
      error: error.message,
    });
  }
};

// Update payment status

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const checkPayment = await PaymentModel.findById(id);
    if (!checkPayment) {
      return res.status(404).json({
        status: "404",
        message: "Payment not found",
      });
    }
    const updatedPayment = await PaymentModel.findByIdAndUpdate(id, {
      status,
    });
    return res.status(200).json({
      status: "200",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

// Deleting payment

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPayment = await PaymentModel.findByIdAndDelete(id);
    if (!deletedPayment) {
      return res.status(404).json({
        status: "404",
        message: "Payment not found",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Payment deleted",
      data: deletedPayment,
    });
  } catch (error) {
    console.error("Error deleting payment:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};
