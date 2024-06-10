import responsesModel from "../models/newconducts.models";
import examModel from "../models/exams.models";
import questionModel from "../models/questions.models";
import optionModel from "../models/options.models";
export const addResponses = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.loggedInUser.id;
    const { responses } = req.body;

    console.log("Exam ID:", examId);
    console.log("User ID:", userId);
    console.log("Responses:", responses);

    const checkExam = await examModel.findById(examId);
    if (!checkExam) {
      return res.status(404).json({
        status: "404",
        message: "Exam not found",
      });
    }

    const savedResponse = await responsesModel.create({
      examId: examId,
      userId: userId,
      responses,
    });
    await examModel.findByIdAndUpdate(
      examId,
      { $push: { conductedBy: userId } },
      { new: true }
    );
    console.log("Saved Response:", savedResponse);

    return res.status(200).json({
      status: "200",
      message: "Your response recorded",
      data: savedResponse,
    });
  } catch (error) {
    console.error("Error saving response:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to respond exam",
      error: error.message,
    });
  }
};

export const getUserResponses = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const userResponses = await responsesModel
      .find({ userId })
      .populate("examId")
      .populate("responses.questionId")
      .populate("responses.selectedOptionId");

    if (!userResponses) {
      return res.status(404).json({
        status: "404",
        message: "No responses found for the user",
      });
    }
    const formattedResponses = await Promise.all(
      userResponses.map(async (response) => {
        const exam = await examModel.findById(response.examId).lean();
        let totalPoints = 0;

        const detailedResponses = await Promise.all(
          response.responses.map(async (resp) => {
            const question = await questionModel
              .findById(resp.questionId)
              .lean();
            const selectedOption = await optionModel
              .findById(resp.selectedOptionId)
              .lean();
            totalPoints += selectedOption.points;

            return {
              ...question,
              selectedOption,
            };
          })
        );

        return {
          ...exam,
          totalPoints,
          responses: detailedResponses,
          submittedAt: response.submittedAt,
        };
      })
    );

    return res.status(200).json({
      status: "200",
      message: "Your responses",
      data: formattedResponses,
    });
  } catch (error) {
    console.error("Error fetching user responses:", error.message);
    return res.status(500).json({
      status: "500",
      message: "Failed to fetch user responses",
      error: error.message,
    });
  }
};
