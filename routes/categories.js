const express = require("express");
const router = express.Router();
const { database } = require("../config/helpers");


router.get("/", function (req, res) {
  database
    .table("categories")
    .withFields(["id", "title","imageUrl"])
    .getAll()
    .then((list) => {
      if (list.length > 0) {
        res.json({
          categories: list,
          count: list.length,
        });
      } else {
        res.json({ message: "NO categories FOUND" });
      }
    })
    .catch((err) => res.json(err));
});

module.exports = router;