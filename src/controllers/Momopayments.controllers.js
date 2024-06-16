import axios from "axios";
import base64 from "base-64";
import * as dotenv from "dotenv";
import MomoPaymentModel from "../models/Momopayments.models";
import CategoryModel from "../models/category.models";
import cron from "node-cron";
dotenv.config();

// Getting payment token

export const getToken = async () => {
  try {
    const username = process.env.MTN_MOMO_USERNAME;
    const password = process.env.MTN_MOMO_API_KEY;
    const credentials = base64.encode(`${username}:${password}`);
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;

    const response = await axios.post(
      `${process.env.MTN_MOMO_GET_TOKEN_URL}`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      }
    );
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error("Error:", error?.message);
  }
};

// request to pay for exams

export const requestToPay = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        status: "404",
        message: "Category not found",
      });
    }
    const catId = existingCategory._id;
    const amount = existingCategory.amount;
    const userId = req.loggedInUser.id;
    const url = `${process.env.MTN_MOMO_REQUEST_PAYMENT_URL}`;
    const target = `${process.env.MTN_MOMO_TARGET_ENVIRONMENT}`;
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
    const token = await getToken();
    const headers = {
      "X-Reference-Id": `${catId}`,
      "X-Target-Environment": target,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      Authorization: `${token}`,
    };

    console.log(headers);
    const body = {
      amount: `${amount}`,
      currency: "EUR",
      externalId: `${userId}`,
      payer: {
        partyIdType: "MSISDN",
        partyId: req.body.phone,
      },
      payerMessage: "string",
      payeeNote: "string",
    };
    console.log(body);

    const response = await axios.post(url, body, { headers });
    req.momoInfo = {
      XReferenceId: headers["X-Reference-Id"],
    };
    next();
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

//Getting transaction status

export const getTransactionStatus = async (req, res) => {
  const { momoInfo } = req;
  try {
    const url = `${process.env.MTN_MOMO_REQUEST_PAYMENT_URL}/${momoInfo.XReferenceId}`;
    const target = process.env.MTN_MOMO_TARGET_ENVIRONMENT;
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
    const token = await getToken();

    const headers = {
      "X-Target-Environment": target,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });
    const { status } = response.data;
    // Log the data values before creating the payment record
    console.log("Data for creating payment record:");
    console.log({
      catId: momoInfo.XReferenceId,
      userId: response.data.externalId,
      amount: response.data.amount,
      paymentMethod: "Momo",
      phone: response.data.payer.partyId,
      paymentStatus: response.data.status,
    });

    // Save data to payment model
    const payment = await MomoPaymentModel.create({
      catId: momoInfo.XReferenceId,
      userId: response.data.externalId,
      amount: response.data.amount,
      paymentMethod: "Momo",
      phone: response.data.payer.partyId,
      paymentStatus: response.data.status,
    });

    // Log the created payment record for verification
    console.log("Created payment record:", payment);

    if (status === "SUCCESSFUL") {
      // Added status check
      return res.status(200).json({
        status: "200",
        message: "Payment succeeded",
        data: response.data,
      });
    } else {
      // Handle other status cases
      return res.status(200).json({
        status: "200",
        message: "Payment status",
        data: response.data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

// Function to update the existanceStatus based on duration
const updateExistanceStatus = async () => {
  try {
    // Find all active payments
    const activePayments = await MomoPaymentModel.find({
      existanceStatus: "active",
    }).populate("catId");

    const currentTime = new Date();

    for (let payment of activePayments) {
      const category = payment.catId;
      const expirationDate = new Date(payment.createdAt);
      expirationDate.setDate(expirationDate.getDate() + category.duration);

      if (currentTime >= expirationDate) {
        payment.existanceStatus = "expired";
        await payment.save();
      }
    }
  } catch (error) {
    console.error("Error updating payment statuses:", error);
  }
};

// This will run every day at midnight
cron.schedule("0 0 * * *", updateExistanceStatus);
