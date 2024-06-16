import CategoryModel from "../models/category.models";
export const addCategory = async (req, res) => {
  try {
    const { examsNumber, amount, duration, type } = req.body;
    if (!examsNumber) {
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
    const checkCategory = await CategoryModel.findOne({ examsNumber });
    if (checkCategory) {
      if (
        checkCategory.examsNumber == examsNumber &&
        checkCategory.type == type
      ) {
        return res.status(400).json({
          status: "400",
          message: "Category with this number of exams exist",
        });
      }
    }
    const recordedCategory = await CategoryModel.create({
      examsNumber,
      amount,
      duration,
      type,
    });
    return res.status(200).json({
      status: "200",
      message: "Category recorded",
      data: recordedCategory,
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
    const { examsNumber, amount, duration, type } = req.body;
    const checkCategory = await CategoryModel.findOne({ examsNumber });
    if (checkCategory) {
      if (checkCategory._id != id && checkCategory.type == type) {
        return res.status(400).json({
          status: "400",
          message: "Category with this number of exam exist",
        });
      }
    }
    const checkedCategory = await CategoryModel.findById(id);
    if (!checkedCategory) {
      return res.status(404).json({
        status: "404",
        message: "Category not fount",
      });
    }
    const updateData = await CategoryModel.findByIdAndUpdate(id, {
      examsNumber,
      amount,
      duration,
      type,
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

// ======= Read all categories without condition ========

export const getAll = async (req, res) => {
  try {
    const allData = await CategoryModel.find().populate({
      path: "exams",
      populate: [
        {
          path: "questions",
          populate: [
            {
              path: "options",
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      status: "200",
      message: "All categories retrieved",
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

// ===== All exams user allowed for free =========

export const getAllFree = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ type: "free" }).populate({
      path: "exams",
      populate: {
        path: "questions",
        populate: {
          path: "options",
        },
      },
    });
    if (!categories) {
      return res.status(404).json({
        status: "404",
        message: "Nta bwoko butishyuzwa burashyirwaho",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Ubwoko butishyuzwa ni ubu!!",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Kugaragaza ubwoko butishyuzwa banze",
      error: error.message,
    });
  }
};

// ===== All exams user has paid =========

export const getAllPaid = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ type: "paid" }).populate({
      path: "exams",
      populate: {
        path: "questions",
        populate: {
          path: "options",
        },
      },
    });
    if (!categories) {
      return res.status(404).json({
        status: "404",
        message: "Nta bwoko bwishyuzwa burashyirwaho",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Ubwoko bwishyuzwa ni ubu!!",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Kugaragaza ubwoko bwishyuzwa banze",
      error: error.message,
    });
  }
};
// Get single category
export const singleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const Data = await CategoryModel.findById(id);
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: "Category not found",
      });
    }
    const allData = await CategoryModel.findById(id);
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
    const checkCategory = await CategoryModel.findById(id);
    if (!checkCategory) {
      return res.status(404).json({
        status: "404",
        message: "Category not found",
      });
    }
    const deletedData = await CategoryModel.findByIdAndDelete(id);
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
