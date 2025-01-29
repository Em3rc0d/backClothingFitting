const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const clothesRoutes = require("./clothes.routes");
const outfitRoutes = require("./outfit.routes");
const categoryRoutes = require("./category.routes");

module.exports = (app) => {
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/clothes", clothesRoutes);
  app.use("/api/outfits", outfitRoutes);
  app.use("/api/categories", categoryRoutes);
};
