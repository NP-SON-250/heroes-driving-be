import questionModel from "../models/questions.models";
import optionModel from "../models/options.models";

export const addOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { option, points } = req.body;
    if (!option || !points) {
      return res.status(400).json({
        status: "400",
        message: "Fill out all fields",
      });
    }

    const findQuestion = await questionModel.findById(id);
    if (!findQuestion) {
      return res.status(404).json({
        status: "404",
        message: "Question not found",
      });
    }
    const checkOption = await optionModel.findOne({ questionId: id });
    if (checkOption) {
      if (checkOption.option === option) {
        return res.status(400).json({
          status: "400",
          message: "This option already exists on this question",
        });
      }
    }
    const currentOptions = await optionModel.find({ questionId: id });

    if (
      currentOptions.some((option) => option.points === 1) &&
      req.body.points >= 1
    ) {
      return res.status(400).json({
        status: "400",
        message:
          "There is already an option with points equal to 1 for this question",
      });
    }
    const createOption = await optionModel.create({
      questionId: id,
      option,
      points,
    });
    await questionModel.findByIdAndUpdate(
      id,
      { $push: { options: createOption._id } },
      { new: true }
    );
    return res.status(200).json({
      status: "200",
      message: "Option added",
      data: createOption,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to add option",
      error: error.message,
    });
  }
};
export const updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { option, points } = req.body;

    if (!option) {
      return res.status(400).json({
        status: "400",
        message: "Option texts are required",
      });
    }
    if (!points) {
      return res.status(400).json({
        status: "400",
        message: "Marks for option is required",
      });
    }
    const existingOption = await optionModel.findById(id);
    if (!existingOption) {
      return res.status(404).json({
        status: "404",
        message: "Option not found",
      });
    }
    const duplicateOption = await optionModel.findOne({
      option,
      questionId: existingOption.questionId,
      _id: { $ne: id },
    });

    if (duplicateOption) {
      return res.status(400).json({
        status: "400",
        message: "Option already exists",
      });
    }
    const updatedData = await optionModel.findByIdAndUpdate(id, {
      option,
      points,
    });

    return res.status(200).json({
      status: "200",
      message: "Option updated",
      data: existingOption,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to update option",
      error: error.message,
    });
  }
};

export const getQuestuionsOption = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuestion = await questionModel.findById(id);
    if (!checkQuestion) {
      return res.status(404).json({
        status: "404",
        message: "Question not found",
      });
    }
    const allData = await optionModel.find({ questionId: id });
    return res.status(200).json({
      status: "200",
      message: "All options retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all options",
      error: error.message,
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const allData = await optionModel.find({});

    return res.status(200).json({
      status: "200",
      message: "All options retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all options",
      error: error.message,
    });
  }
};

export const singleOption = async (req, res) => {
  try {
    const { id } = req.params;
    const Data = await optionModel.findById(id);
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: "Option not found",
      });
    }
    const allData = await optionModel.findById(id);
    return res.status(200).json({
      status: "200",
      message: "Single option retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve all option",
      error: error.message,
    });
  }
};

export const deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    const checkOption = await optionModel.findById(id);
    if (!checkOption) {
      return res.status(404).json({
        status: "404",
        message: "Option not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete option",
      error: error.message,
    });
  }
};
