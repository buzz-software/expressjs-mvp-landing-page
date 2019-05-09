

// Create Stripe Products to display on our site.

var env  = process.env.NODE_ENV || 'development';
//let configs = { development, production, beta } = require('./config/cloud_config');
//const {twitter, google, facebook} = configs[env];
const models = require('../models')

const sidepanel = require('../helpers/sidepanel');
const panel = sidepanel.panel


const productPrefix = "SaaS_";

var stripe = require("stripe")("sk_test_NJ73Ciw9UF0TNSERdKlZWXgH");


// Create sanitized version of submitted plan
const sanitizedProduct = function(req, res, next) {
	let product = {
		name: req.body.product_name,
		description: req.body.product_description,
		price : (req.body.plan_price == "") ? 0 : Number(req.body.product_price),
		discount_pct : (req.body.product_discount_pct == "") ? 0 : Number(req.body.product_discount_pct),
		cta: req.body.product_cta,
		feature1: req.body.product_feature1,
		feature2: req.body.product_feature2,
		feature3: req.body.product_feature3,
		feature4: req.body.product_feature4,
		feature5: req.body.product_feature5,
		feature6: req.body.product_feature6,
		feature7: req.body.product_feature7,
		feature8: req.body.product_feature8,
		feature9: req.body.product_feature9,
		feature10: req.body.product_feature10,	
		rank : (req.body.product_rank == "") ? 0 : Number(req.body.product_rank),	
	}
	return product;
}

exports.show_create_product = function(req, res, next) {
	res.render('product/create_product', { panel });
}


const createStripeProductAndSku = function(req, res, next, product) {
	return stripe.products.create({
	  name: product.name,
	  type: 'good',
	  description: product.description,
	}).then(stripe_product => {
		return stripe.skus.create({
			product: stripe_product.id,
			price: product.price * 100,	// In pennies.
			currency: 'usd',
			inventory: {type: 'infinite'}
		});
	})
}

exports.submit_product = function(req, res, next) {

	let product = sanitizedProduct(req);

	return createStripeProductAndSku(req, res, next, product).then(stripe_sku => {
		product.stripe_ProductId = stripe_sku.product;
		product.stripe_SkuId = stripe_sku.id;
		return models.Product.create( product ).then(result => {
			res.redirect('/d/products');
		}).catch(err => next(err));
	})
}

exports.show_products = function(req, res, next) {
	return models.Product.findAll().then(products => {
 		res.render('product/products', { title: 'Express', products, panel });		
	})
}

exports.show_product = function(req, res, next) {
	return models.Product.findOne({
		where : {
			id : req.params.product_id
		}
	}).then(product => {
		res.render('product/product', { product, panel });
	});
}


exports.show_edit_product = function(req, res, next) {
	return models.Product.findOne({
		where : {
			id : req.params.product_id
		}
	}).then(product => {
		res.render('product/edit_product', { product, panel });
	});
}

// Just updates the SKU price for now.
const stripeUpdateProductPrice = function(req, res, next, product, params) {
	return stripe.skus.update(
		product.stripe_SkuId,
		{ price: params.price * 100 }
	);
}

exports.edit_product = function(req, res, next) {
	let updateParams = sanitizedProduct(req);

	// Re-create stripe product if price/period has changed.
	return models.Product.findOne({
		where: {
			id: req.params.product_id}
		}).then(existingproduct => {
		// If product requires updating the SKU
		if (updateParams.price != existingproduct.price) {
			return stripeUpdateProductPrice(req, res, next, existingproduct, updateParams).then(newParams => {
				// Save existing product with new stripe ids.
				return models.Product.update(updateParams, {where: { id: req.params.product_id }}).then(result => {
					res.redirect('/d/product/' + req.params.product_id);
				})
			})
		} else {
			// Save existing product, no stripe updates were needed.
			return models.Product.update(updateParams, { where: { id: req.params.product_id }}).then(result => {
				res.redirect('/d/product/' + req.params.product_id);
			})
		}
	});
}

// Deletes product, if noone else uses product's product id, delete product as well.
exports.delete_product = function(req, res, next) {
	return models.Product.findOne({
		where: { id: req.params.product_id}
		}).then(product => {
			console.log("My product:", product);
			// Delete SKU -> Fails if sales happened. Its ok.
			return stripe.skus.del(product.stripe_SkuId).then(sku_del_res => {
				// Delete Stripe Product
				return stripe.products.del(product.stripe_ProductId).then(result => {
					// Delete Our record of product.
					return product.destroy().then(result => {
						res.redirect('/d/products');
				})				
			}).catch(err => next(err))
		}).catch(err => next(err))
	}).catch(err => next(err))
}


exports.show_user_products = function(req, res, next) {
	return models.Product.findAll().then(products => {
		res.render("products", { products });
	});
}