import examModel from "../models/exams.models";
import questionModel from "../models/questions.models";
import CategoryModel from "../models/category.models";
import responsesModel from "../models/newconducts.models";
export const addExam = async (req, res) => {
  try {
    const {catId} =req.params;
    const { title, time } = req.body;
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
    
    const checkTitle = await examModel.findOne({ categoryId: catId });
    if (checkTitle) {
      if (checkTitle.title === title) {
        return res.status(400).json({
          status: "400",
          message: "Exam already exists for this category",
        });
      }
    }
    const checkCategory = await CategoryModel.findById(catId);
    if(!checkCategory){
      return res.status(404).json({
        status:"404",
        message:"Category not found",
      })
    }
    const recordedExam = await examModel.create({
      title,
      time,
      categoryId: catId,
    });
    await CategoryModel.findByIdAndUpdate(
      catId,
      { $push: { exams: recordedExam._id } },
      { new: true }
    );
    return res.status(200).json({
      status: "200",
      message: "Exam recorded",
      data: recordedExam,
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
    const { title, time } = req.body;
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
    },{ new: true } );
    return res.status(200).json({
      status: "200",
      message: "Exam updated",
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

// ======= Read all exams for given category ========
export const  getFreaaExams = async (req, res) => {
  try {    
    // Check if category exists
    const checkCategory = await CategoryModel.findOne({type:"free"});
    const id = checkCategory.id;
    // Fetch exams excluding those that the user has already responded to
    const allData = await examModel
      .find({ categoryId: id})
      .populate({
        path: "questions",
        populate: [
          {
            path: "options",
          },
        ],
      });

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
// ======= Read all exams for given category ========
export const getCategoryExams = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const checkCategory = await CategoryModel.findById(id);
    if (!checkCategory) {
      return res.status(404).json({
        status: "404",
        message: "Category not found",
      });
    }

    // Fetch exams excluding those that the user has already responded to
    const allData = await examModel
      .find({ categoryId: id})
      .populate({
        path: "questions",
        populate: [
          {
            path: "options",
          },
        ],
      });

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
