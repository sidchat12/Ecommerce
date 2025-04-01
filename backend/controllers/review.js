require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const oracledb = require('oracledb');


const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};


//function to allow user to add reviews on a product
async function addreview(req, res){
    const {rating, review } = req.body;
    let review_id=uuidv4();
    let {user_id,product_id}=req.params;
    if (!review_id || !user_id || !product_id || rating === undefined || !review) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'Review stars must be between 0 and 5' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const userExists = await connection.execute(
            `SELECT COUNT(*) AS count FROM user_table WHERE user_id = :user_id`,
            { user_id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (userExists.rows[0].COUNT === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const productExists = await connection.execute(
            `SELECT COUNT(*) AS count FROM product WHERE product_id = :product_id`,
            { product_id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (productExists.rows[0].COUNT === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await connection.execute(
            `INSERT INTO review_table (review_id,   review_stars, review_text, review_time) 
             VALUES (:review_id,  :rating, :review, SYSTIMESTAMP)`,
            { review_id,  rating, review },
            { autoCommit: true }
        );

        await connection.execute(
            `insert into reviews (review_id,user_id,product_id) values (:review_id,:user_id,:product_id)`,
            {review_id,user_id,product_id},{autoCommit:true}
        );

        res.status(201).json({ message: 'Review added successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}



//to display reviews under each products
 async function get_reviews_by_id(req, res) {
    const { product_id } = req.params;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `SELECT rev.review_id, r.user_id, rev.rating, rev.review, rev.review_time 
                     FROM review_table rev,reviews r where rev.review_id=r.review_id and r.product_id=:product_id`;

        const result = await connection.execute(sql, { product_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        }

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports={
    get_reviews_by_id,
    addreview

}














