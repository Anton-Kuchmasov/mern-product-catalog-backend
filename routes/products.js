import { Router } from 'express';
import { Decimal128, ObjectId } from 'mongodb';

import { getDb, initDb } from '../db.js';

const router = Router();

router.get('/', (req, res, next) => {
  const products = [];

  getDb()
    .db()
    .collection('products')
    .find()
    .forEach(productDoc => {
      productDoc.price = productDoc.price.toString();
      products.push(productDoc);
    })
    .then(result => {
      res.status(200).json(products);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred!' });
    });
})

router.get('/:id', (req, res, next) => {
  getDb()
    .db()
    .collection('products')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(productDoc => {
      productDoc.price = productDoc.price.toString();
      res.status(200).json(productDoc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred while adding a new product!' });

    });
});

router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()),
    image: req.body.image
  };
  getDb()
    .db()
    .collection('products')
    .insertOne(newProduct)
    .then(result => {
      console.log(result);
      res.status(201).json({ message: 'Product added', productId: 'DUMMY' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred while adding a new product!' });

    });
})

router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()),
    image: req.body.image
  };
  getDb()
    .db()
    .collection('products')
    .updateOne({ _id: new ObjectId(req.params.id) },
      {
        $set: updatedProduct
      })
    .then(result => {
      res
        .status(200)
        .json({ message: 'Product updated', productId: req.params.id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred while updating a new product!' });
    });
});

router.delete('/:id', (req, res, next) => {
  getDb()
    .db()
    .collection('products')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((product) => {
      res.status(200).json({ message: `Product with ID ${product.id} deleted` });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred while deleting a product!' });

    });
});

export default router;
