import FaqsModel from "../models/faqs.models";
import ReplyModel from "../models/replyFaqs.models";

//record reply
export const recordReply = async (req, res) => {
  try {
    const { faqId } = req.params;
    const userId = req.loggedInUser.id;
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({
        status: "400",
        message: "Reply text is required",
      });
    }
    const findFaq = await FaqsModel.findById(faqId);
    if (!findFaq) {
      return res.status(404).json({
        status: "404",
        message: "Ikibazo usabye gusubiza ntikibonetse.",
      });
    }
    const savedReply = await ReplyModel.create({
      reply,
      question: faqId,
      repliedBy: userId,
    });
    await FaqsModel.findByIdAndUpdate(
      faqId,
      { $push: { replies: savedReply._id } },
      { new: true }
    );
    return res.status(200).json({
      status: "200",
      message: "Igisubizo cyawe cyakiriwe",
      data: savedReply,
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

// Geting all reply for given question

export const allReplies = async (req, res) => {
  try {
    const { faqId } = req.params;
    const allData = await ReplyModel.find({ question: faqId }).populate({
      path: "question",
    });
    return res.status(200).json({
      status: "200",
      message: "Ibisubizo",
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

// Geting single reply

export const singleReply = async (req, res) => {
  try {
    const { id } = req.params;
    const singleData = await ReplyModel.findById(id)
    .populate({
      path: "question",
    });
    if (!singleData) {
      return res.status(404).json({
        status: "404",
        message: "Igisubizo ntikibonetse byagateganyo",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Igisubizo ni iki:",
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

export const updateReply = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const { id } = req.params;
    const { reply } = req.body;
    const findReply = await ReplyModel.findById(id);
    if (!findReply) {
      return res.status(404).json({
        status: "404",
        message: "Igisubizo ntikibonetse",
      });
    }
    const replyOwner = findReply.repliedBy;
    console.log(replyOwner);
    if (replyOwner === userId) {
      const updatedReply = await ReplyModel.findByIdAndUpdate(
        id,
      { reply },
      { new: true } 
      );
      return res.status(200).json({
        status: "200",
        message: "Igisubizo cyahinduwe",
        data: updatedReply,
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

// Delete Reply

export const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.loggedInUser.id;
    const findReply = await ReplyModel.findById(id);
    if (!findReply) {
      return res.status(404).json({
        status: "404",
        message: "Igisubizo ntikibonetse",
      });
    }
    const replyOwner = findReply.repliedBy;
    console.log(replyOwner);
    if (replyOwner === userId) {
      const deletedReply = await ReplyModel.findByIdAndDelete(id);
      return res.status(200).json({
        status: "200",
        message: "Ikibazo cyasibwe",
        data: deletedReply,
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
