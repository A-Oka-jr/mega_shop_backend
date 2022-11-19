const express = require("express");
const router = express.Router();
const { database } = require("../config/helpers");

/* GET all products. */
router.get("/", function (req, res) {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  let limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10;

  let startValue;
  let endValue;


  if (page > 0) {
    startValue = page * limit - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: "c.id = p.cat_id",
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.image",
      "p.description",
      "p.id",
    ])
    .slice(startValue, endValue)
    .sort({ id: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods,
        });
      } else {
        res.json({ msg: "no products Found" });
      }
    })
    .catch((err) => console.log(err));
});

/* Get single product */
router.get("/:prodId", function (req, res) {
  let productId = req.params.prodId;
  // console.log(productId)

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: "c.id = p.cat_id",
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.image",
      "p.images",
      "p.description",
      "p.id",
    ])
    .filter({ "p.id": productId })
    .get()
    .then((prod) => {
      if (prod) {
        res.status(200).json(prod);
      } else {
        res.json({
          msg: `no product Found whit productId match whit: ${productId}`,
        });
      }
    })
    .catch((err) => console.log(err));
});

/* Get product they match in catighory */
router.get("/category/:catName", function (req, res) {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  let limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10;
  const catTitle = req.params.catName;
  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: `c.id = p.cat_id where c.title like '%${catTitle}%'`,
      },
    ])
    .withFields([
      "c.title as category",
      "c.title as name",
      "p.price",
      "p.quantity",
      "p.image",
      "p.id",
    ])
    .slice(startValue, endValue)
    .sort({ id: 0.1 })
    .getAll()
    .then((pords) => {
      if (pords.length > 0) {
        console.log(prods);
        res.status(200).json({
          count: pords.length,
          products: pords,
        });
      } else {
          console.log(prods);
        res.json({ msg: `no products Found in this category ${catTitle}` });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/categories", function (req, res) {
  database
    .table("categories")
    .withFields(["id", "title","imageUrl"])
    .get()
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

router.get("/orders/topSailing", function (req, res) {
  console.log("dwefwf seff sfrgsv sf");
  database
    .query(
      `select p.title as name,p.image,p.id, p.price,c.title, count(od.quantity) as top_sale
       from orders_details as od
        JOIN products as p on p.id = od.product_id
        JOIN categories c on c.id = p.cat_id
        group by od.product_id ORDER BY count(od.quantity)
        DESC LIMIT 3`
    )
    .then((list) => {
      console.log(list+" 179");
      if (list.length > 0) {
        res.json({
          data: list,
        });
      } else {
        res.json({ message: "NO topSaling FOUND" });
      }
    })
    .catch((err) => res.json(err));
});

router.get("/products/count", function (req, res) {
  database
    .query(
      `select count(id) as countAll  from products`
    )
    .then((list) => {
      console.log(list + " 198");
      if (list.length > 0) {
        res.json({
          data: list,
        });
      } else {
        res.json({ message: "NO topSaling FOUND" });
      }
    })
    .catch((err) => res.json(err));
});


module.exports = router;
