const admin = (req, res, next) => {
  try {
    const adminUser = req.user.role === "admin";

    if (adminUser) {
      return next();
    }

    throw new Error({ message: "Unauthorized request" });
  } catch (error) {
    res.status(401).send({ message: error.message, success: false });
  }
};

module.exports = admin;
