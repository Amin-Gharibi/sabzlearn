const userModel = require("../../models/user");
const banUserModel = require("../../models/ban-phone");
const courseUserModel = require("../../models/course-user");
const bcrypt = require("bcrypt");

exports.getAll = async (req, res, next) => {
  try {
    const users = await userModel.find();

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { name, username, email, currentPassword, newPassword, phone, role } = req.body;
    const { id } = req.params;
    await userModel.editUserValidation({ ...req.body, id }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const wantToUpdatePassword = newPassword ? true : false;
    const isAdminRequesting = (req.user.role === "ADMIN")
    if (!isAdminRequesting && wantToUpdatePassword) {
      const user = await userModel.findById(id)
      const oldPasswordHashed = await bcrypt.hash(currentPassword, 12)
      if (user.password !== oldPasswordHashed) {
        return res
          .status(403)
          .json({ msg: "access denied" })
      }
    }

    if (!isAdminRequesting && role) {
      return res
        .status(403)
        .json({ msg: "access denied" })
    }

    const hashedPassword = newPassword
      ? await bcrypt.hash(newPassword, 12)
      : undefined;

    const oldUser = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
        password: hashedPassword,
        phone,
        role,
        profile: Boolean(req.file?.filename) === true ? req.file.filename : undefined
      },
      { new: true }
    );

    const updatedUser = await userModel.findById(oldUser._id);

    if (oldUser.profile !== updatedUser.profile) {
      const imgPath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "profile",
        oldUser.cover
      );

      fs.unlink(imgPath, async (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    return res.json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    await userModel.removeUserValidation(req.params).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const deletedUser = await userModel.findOneAndRemove({
      _id: req.params.id,
    });

    if (!deletedUser) {
      return res.status(404).json("There is not user");
    }

    return res.status(200).json("User Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    await userModel.removeUserValidation(req.params).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const mainUser = await userModel.findOne({ _id: req.params.id }).lean();
    if (!mainUser) {
      return res.status(404).json("User not Found!");
    }

    const banUserResult = banUserModel.create({ phone: mainUser.phone });

    if (banUserResult) {
      const isBanned = 1
      await userModel.findByIdAndUpdate(req.params.id, { isBanned }).catch(err => {
        err.statusCode = 400
        throw err
      })
      return res.status(200).json({ msg: "User banned successfully" });
    }
    return res.status(500).json({ msg: "Error" });
  } catch (error) {
    next(error);
  }
};

exports.unBanUser = async (req, res, next) => {
  try {
    await userModel.removeUserValidation(req.params).catch(err => {
      err.statusCode = 400;
      throw err;
    })

    const targetUser = await userModel.findOne({ _id: req.params.id }).lean();
    if(!targetUser) {
      return res.status(404).json("User not Found!")
    }

    const unBanUserResult = await banUserModel.findOneAndRemove({ phone: targetUser.phone})

    if (unBanUserResult) {
      const isBanned = 0
      await userModel.findByIdAndUpdate(req.params.id, { isBanned }).catch(err => {
        err.statusCode = 400
        throw err
      })
      return res.status(200).json({ msg: "User unbanned successfully" });
    }

    return res.status(500).json({ msg: "Error" });
  } catch (error) {
    next(error)
  }
}

exports.getUserCourses = async (req, res, next) => {
  try {
    const userCourses = await courseUserModel
      .find({ user: req.user._id })
      .populate("course")
      .lean();

    res.json(userCourses);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    await userModel.updateUserValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const { name, username, email, password, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        name,
        username,
        email,
        password: hashedPassword,
        phone,
      }
    );

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    await userModel.changeUserRoleValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const { role, id } = req.body;
    console.log(role);

    const user = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        role: role,
      }
    );

    res.json({ msg: `User role changed to ${role} successfully` });
  } catch (error) {
    next(error);
  }
};
