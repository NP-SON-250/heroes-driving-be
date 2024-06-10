import PaidCategoryModel from "../models/paidcategory.models";

export const addCategory = async (req, res) => {
  try {
    const { exams, amount, duration } = req.body;
    if (!exams) {
      return res.status(400).json({
        status: "400",
        message: "Number of exam is required",
      });
    }
    if (!amount) {
      return res.status(400).json({
        status: "400",
        message: "Amount to be paid is required",
      });
    }
    if (!duration) {
      return res.status(400).json({
        status: "400",
        message: "Exired time is required",
      });
    }
    const checkExam = await PaidCategoryModel.findOne({ exams });
    if (checkExam) {
      if (checkExam.exams == exams) {
        return res.status(400).json({
          status: "400",
          message: "Category with this number of exams exist",
        });
      }
    }
    const recordCategory = await PaidCategoryModel.create({
      exams,
      amount,
      duration,
    });
    return res.status(200).json({
      status: "200",
      message: "Category recorded",
      data: recordCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to add category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { exams, amount, duration } = req.body;
    const checkExams = await PaidCategoryModel.findOne({ exams });
    if (checkExams) {
      if (checkExams._id != id) {
        return res.status(400).json({
          status: "400",
          message: "Category with this number of exam exist",
        });
      }
    }
    const checkCategory = await PaidCategoryModel.findById(id);
    if (!checkCategory) {
      return res.status(404).json({
        status: "404",
        message: "Category not fount",
      });
    }
    const updateData = await PaidCategoryModel.findByIdAndUpdate(id, {
      exams,
      amount,
      duration,
    });
    return res.status(200).json({
      status: "200",
      message: "Category updated",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const allData = await PaidCategoryModel.find();

    return res.status(200).json({
      status: "200",
      message: "Categorie retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};

export const singleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const Data = await PaidCategoryModel.findById(id);
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: "Category not found",
      });
    }
    const allData = await PaidCategoryModel.findById(id);
    return res.status(200).json({
      status: "200",
      message: "Single category retrieved",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve single category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkCategory = await PaidCategoryModel.findById(id);
    if (!checkCategory) {
      return res.status(404).json({
        status: "404",
        message: "Category not found",
      });
    }
    const deletedData = await PaidCategoryModel.findByIdAndDelete(id);
    return res.status(200).json({
      status: "200",
      message: "Category deleted",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
