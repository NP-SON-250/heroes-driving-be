import examModel from "../modelssd/exams.models";
import questionModel from "../modelssd/questions.models";

export const addExam = async (req, res) => {
  try {
    const { title, time, category } = req.body;
    if (!title) {
      return res.status(400).json({
        status: "400",
        message: "Title of exam is required",
      });
    }
    if (!time) {
      return res.status(400).json({
        status: "400",
        message: "Time of exam is required",
      });
    }
    const checkTitle = await examModel.findOne({ title });
    if (checkTitle) {
      if (checkTitle.category == "paid") {
        return res.status(400).json({
          status: "400",
          message: "Exam title exist",
        });
      }
    }
    const recordExam = await examModel.create({
      title,
      time,
      category,
    });
    return res.status(200).json({
      status: "200",
      message: "Exam recorded",
      data: recordExam,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to add exam",
      error: error.message,
    });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, time, category } = req.body;
    const checkTitle = await examModel.findOne({ title });
    if (checkTitle) {
      if (checkTitle._id != id) {
        return res.status(400).json({
          status: "400",
          message: "Exam title exist",
        });
      }
    }
    const checkExam = await examModel.findById(id);
    if (!checkExam) {
      return res.status(404).json({
        status: "404",
        message: "Exam not fount",
      });
    }
    const updateData = await examModel.findByIdAndUpdate(id, {
      title,
      time,
      category,
    });
    return res.status(200).json({
      status: "200",
      message: "Exam updated",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

// ======= Read all exams without condition ========

export const getAll = async (req, res) => {
  try {
    const allData = await examModel
      .find()
      // .sort({ _id: -1 }) // Sort exams by _id in descending order to get the latest ones
      .populate({
        path: "questions",
        populate: [
          {
            path: "options",
          },
        ],
      });
    // .limit(2);  /// Get only 2 exams

    return res.status(200).json({
      status: "200",
      message: "All exams retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve exams",
      error: error.message,
    });
  }
};

export const getAllFree = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const allData = await examModel
      .find({ category: "free", conductedBy: { $nin: [userId] } })
      .populate({
        path: "questions",
        populate: [
          {
            path: "options",
          },
        ],
      });
    if (allData.length === 0) {
      return res.status(201).json({
        status: "201",
        message: "Wasoje gukora ikizamini cy'ubuntu, gura kode",
      });
    }

    return res.status(200).json({
      status: "200",
      message: "All free exams retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all exams",
      error: error.message,
    });
  }
};

// ===== All exams user has paid =========

export const getAllPaid = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const allData = await examModel
      .find({ category: "paid", conductedBy: { $nin: [userId] } })
      .populate({
        path: "questions",
        populate: [
          {
            path: "options",
          },
        ],
      });
    if (allData.length === 0) {
      return res.status(201).json({
        status: "201",
        message: "You have exhoused your bonus",
      });
    }

    return res.status(200).json({
      status: "200",
      message: "All free exams retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all exams",
      error: error.message,
    });
  }
};

// ======== Read single exam ========

export const singleExam = async (req, res) => {
  try {
    const { id } = req.params;
    const Data = await examModel.findById(id);
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: "Exam not found",
      });
    }
    const allData = await examModel.findById(id).populate({
      path: "questions",
      populate: [
        {
          path: "options",
        },
      ],
    });
    return res.status(200).json({
      status: "200",
      message: "Single exam retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve single exam",
      error: error.message,
    });
  }
};

// ======== Delete exam =======

export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const checkExam = await examModel.findById(id);
    if (!checkExam) {
      return res.status(404).json({
        status: "404",
        message: "Exam not found",
      });
    }
    await questionModel.deleteMany({ examId: id });
    const deletedData = await examModel.findByIdAndDelete(id);
    return res.status(200).json({
      status: "200",
      message: "Exam deleted",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete exam",
      error: error.message,
    });
  }
};
