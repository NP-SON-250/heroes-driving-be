import questionModel from "../models/questions.models";
import examModel from "../models/exams.models";
import optionModel from "../models/options.models";

export const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        status: "400",
        message: "Enter question text!",
      });
    }
    const findExam = await examModel.findById(id);
    if (!findExam) {
      return res.status(404).json({
        status: "404",
        message: "Exam not found",
      });
    }

    const checkQuestion = await questionModel.findOne({ examId: id });
    if (checkQuestion) {
      if (checkQuestion.question === question) {
        return res.status(400).json({
          status: "400",
          message: "Question already exists for this exam",
        });
      }
    }

    const totalMarks = await questionModel.aggregate([
      {
        $match: { examId: findExam._id },
      },
      {
        $group: {
          _id: null,
          totalMarks: { $sum: "$marks" },
        },
      },
    ]);

    if (totalMarks.length > 0 && totalMarks[0].totalMarks >= findExam.marks) {
      return res.status(400).json({
        status: "400",
        message: "Total questions' marks can't exceed exam marks",
      });
    }
    const createQuestion = await questionModel.create({
      examId: id,
      question,
    });
    await examModel.findByIdAndUpdate(
      id,
      { $push: { questions: createQuestion._id } },
      { new: true }
    );

    return res.status(200).json({
      status: "200",
      message: "Question added",
      data: createQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to add question",
      error: error.message,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    const existingQuestion = await questionModel.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({
        status: "404",
        message: "Question not found",
      });
    }
    const duplicateQuestion = await questionModel.findOne({
      question,
      examId: existingQuestion.examId,
      _id: { $ne: id },
    },{ new: true } );

    if (duplicateQuestion) {
      return res.status(400).json({
        status: "400",
        message: "Question already exists",
      });
    }
    existingQuestion.question = question;
    await existingQuestion.save();

    return res.status(200).json({
      status: "200",
      message: "Question updated",
      data: existingQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to update question",
      error: error.message,
    });
  }
};

export const getExamsQuestuions = async (req, res) => {
  try {
    const { id } = req.params;
    const checkExam = await examModel.findById(id);
    if (!checkExam) {
      return res.status(404).json({
        status: "404",
        message: "Exam not found",
      });
    }
    const allData = await questionModel.find({ examId: id }).populate({
      path: "options",
    });
    return res.status(200).json({
      status: "200",
      message: "All questions retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all questions",
      error: error.message,
    });
  }
};
export const singleQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const Data = await questionModel.findById(id);
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: "Question not found",
      });
    }
    const allData = await questionModel.findById(id).populate({
      path: "options",
    });
    return res.status(200).json({
      status: "200",
      message: "Single question retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all question",
      error: error.message,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuestion = await questionModel.findById(id);
    if (!checkQuestion) {
      return res.status(404).json({
        status: "404",
        message: "Question not found",
      });
    }
    await optionModel.deleteMany({ questionId: id });
    const deletedData = await questionModel.findByIdAndDelete(id);
    return res.status(200).json({
      status: "200",
      message: "question deleted",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete question",
      error: error.message,
    });
  }
};


export const allQuestions = async (req, res)=>{
  try {
    const examsData = await questionModel.find();
    return res.status(200).json({
      status:"200",
      message:"Questions retrieved.",
      data: examsData,
    })
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve questions",
      error: error.message,
    });
  }
  }
