const offModel = require("../../models/off");
const courseModel = require("../../models/course");

exports.create = async (req, res, next) => {
  try {
    await offModel.createValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });
    const { code, percent, course, max } = req.body;

    const newOff = await offModel.create({
      code,
      percent,
      course,
      max,
      uses: 0,
      creator: req.user._id,
    });

    return res.status(201).json(newOff);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const allOffs = await offModel
      .find()
      .populate("creator", "-password")
      .lean();
    if (allOffs.length === 0) {
      return res.status(404).json({ message: "No Off Available!" });
    }
    const offs = [];

    allOffs.forEach((off) => {
      offs.push({
        ...off,
        creator: off.creator.name,
      });
    });

    res.json(offs);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { course } = req.body;
    await offModel.getOneValidation({ code, course }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const off = await offModel.findOne({ code, course }).lean();

    if (!off) {
      return res.status(404).json({ message: "Code is not valid" });
    } else if (off.max === off.uses) {
      return res.status(409).json({ message: "This code already used." });
    } else {
      await offModel.findOneAndUpdate(
        { code, course },
        {
          uses: off.uses + 1,
        }
      );
      return res.json(off);
    }
  } catch (error) {
    next(error);
  }
};

exports.cancelRedeemCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { course } = req.body;
    await offModel.getOneValidation({ code, course }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const off = await offModel.findOne({ code, course }).lean();

    if (!off) {
      return res.status(404).json({ message: "Code is not valid" });
    } else if (off.uses === 0) {
      return res.json("successfully canceled")
    } else {
      await offModel.findOneAndUpdate(
        { code, course },
        {
          uses: off.uses - 1,
        }
      );
      return res.json("successfully canceled");
    }
  } catch (err) {
    next(err);
  }
}

exports.remove = async (req, res, next) => {
  try {
    await offModel.removeValidation(req.params).catch((err) => {
      err.statusCode = 400;
      throw err;
    });
    const deletedOff = await offModel.findOneAndRemove({
      _id: req.params.id,
    });
    if (!deletedOff) {
      return res.status(404).json({ message: "Off Code Not Found!" });
    }
    return res.json(deletedOff);
  } catch (error) {
    next(error);
  }
};

exports.setOnAll = async (req, res, next) => {
  try {
    await offModel.setAllValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });
    const { discount } = req.body;

    if (discount == 100) {
      return res.status(400).json({ msg: "discount cannot be 100" })
    }

    // Only update rows with a discount amount other than 100
    const setDiscountsOnCourses = await courseModel.updateMany({
      discount: { $ne: 100 } // $ne stands for "not equal"
    }, {
      $set: { discount } // Update the discount to the provided value
    });

    return res.json({ msg: "Discounts set successfully ✌️" });
  } catch (error) {
    next(error);
  }
};

exports.unsetOnAll = async (req, res, next) => {
  try {
    const discount = 0;
    // Unset discounts for rows where discount is not equal to 100
    const unsetDiscountsOnCourses = await courseModel.updateMany({
      discount: { $ne: 100 } // $ne stands for "not equal"
    }, {
      $set: { discount } // set the discount to 0
    });

    return res.json({ msg: "Discounts unset successfully ✌️" });
  } catch (error) {
    next(error);
  }
}
