import FaqsModel from "../models/faqs.models";
export const recordFaqs = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        status: "400",
        message: "Question text is required",
      });
    }
    const savedData = await FaqsModel.create({
      question,
      askedBy: userId,
    });
    return res.status(200).json({
      status: "200",
      message: "Ikibazo cyawe cyakiriwe",
      data: savedData,
    });
  } catch (error) {
    console.error("Habaye ikibazo:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Habaye ikibazo",
      error: error.message,
    });
  }
};

// Geting all FAQS

export const allFaqs = async (req, res) => {
  try {
    const allData = await FaqsModel.find().populate({
      path: "replies",
    });
    return res.status(200).json({
      status: "200",
      message: "Ibyabajijwe",
      data: allData,
    });
  } catch (error) {
    console.error("Habaye ikibazo:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Habaye ikibazo",
      error: error.message,
    });
  }
};

// Geting single FAQS

export const singleFaqs = async (req, res) => {
  try {
    const { id } = req.params;
    const singleData = await FaqsModel.findById(id).populate({
      path: "replies",
    });
    if (!singleData) {
      return res.status(404).json({
        status: "404",
        message: "Ikikibazo ntikibonetse byagateganyo",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Ikibazo ni iki:",
      data: singleData,
    });
  } catch (error) {
    console.error("Habaye ikibazo:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Habaye ikibazo",
      error: error.message,
    });
  }
};

export const updateFaqs = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const { id } = req.params;
    const { question } = req.body;
    const findFaq = await FaqsModel.findById(id);
    if (!findFaq) {
      return res.status(404).json({
        status: "404",
        message: "Ikibazo ntikibonetse",
      });
    }
    const faqOwner = findFaq.askedBy;
    console.log(faqOwner);
    if (faqOwner === userId) {
      const updatedFaq = await FaqsModel.findByIdAndUpdate(
        id,
      { question },
      { new: true } 
      );
      return res.status(200).json({
        status: "200",
        message: "Ikibazo cyahinduwe",
        data: updatedFaq,
      });
    }
  } catch (error) {
    console.error("Habaye ikibazo:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Habaye ikibazo",
      error: error.message,
    });
  }
};

// Delete FAQS

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.loggedInUser.id;
    const findFaq = await FaqsModel.findById(id);
    if (!findFaq) {
      return res.status(404).json({
        status: "404",
        message: "Ikibazo ntikibonetse",
      });
    }
    const faqOwner = findFaq.askedBy;
    console.log(faqOwner);
    if (faqOwner === userId) {
      const deletedFaq = await FaqsModel.findByIdAndDelete(id);
      return res.status(200).json({
        status: "200",
        message: "Ikibazo cyasibwe",
        data: deletedFaq,
      });
    }
  } catch (error) {
    console.error("Habaye ikibazo:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Habaye ikibazo",
      error: error.message,
    });
  }
};
