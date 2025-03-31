const express=require('express');
const app=express();
const cors = require("cors");

const{seller_login,seller_signup,user_login,user_signup,authenticateJWT,isLoggedIn}=require('./middlewares/authentication.js');
const{
    update_user_address,
    getuser,
    getseller,
    update_user_id
}=require('./controllers/user.js');
const{ purchase,
    get_user_history,
    get_order,
    initiate_purchase}=require('./controllers/transaction.js')
const {get_reviews_by_id,
    addreview}=require('./controllers/review.js');

const{ add_product, upload,get_product,get_product_by_category,get_product_for_homepage }=require('./controllers/product.js')
const{add_address}=require('./controllers/address.js');

const { createTables,dropTables } = require('./db_config/init_functions.js');


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.listen(5000, async () => {
    console.log('Server running on port 3000');
    await dropTables();
    await createTables();
});

app.post('/seller/signup',seller_signup);
app.post('/seller/login',seller_login);
app.post('/user/signup',user_signup);
app.post('/user/login',user_login);

app.get('/product/:product_id',get_product);
app.get('/user/user:id/:product_id',get_product);
app.post('/seller/:seller_id/addproduct',isLoggedIn,upload.single('photo'),add_product);
app.post('/seller/:seller_id/addaddress',isLoggedIn,add_address);
app.post('/user/:user_id/addaddress',isLoggedIn,add_address);

app.get('/user/:user_id/profile',isLoggedIn,getuser);
app.get('/seller/:seller_id/profile',isLoggedIn,getseller);
app.post('/user/:user_id/updateaddress',isLoggedIn,update_user_address);

app.post('/user/:user_id/:product_id/addreview',isLoggedIn,addreview);
app.get('/user/:user_id/:product_id/review',get_reviews_by_id);
app.get('/product/:product_id/reviews',get_reviews_by_id);

app.get('/category/:category',get_product_by_category);
app.get('/user/:user_id/category/:category',get_product_by_category);

app.get('/home',get_product_for_homepage);
app.get('/user/:user_id/:product_id/order',isLoggedIn,initiate_purchase);
app.post('/user/:user_id/:product_id/order',isLoggedIn,purchase);

app.get('/user/:user_id/:order_id',isLoggedIn,get_order);
app.get('/user/:user_id/history',isLoggedIn,get_user_history);