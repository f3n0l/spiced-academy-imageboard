const spicedPg = require("spiced-pg");
const DATABASE_NAME = "imageboard";
const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");
const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

function getImages() {
    return db
        .query("SELECT * FROM images ORDER BY id DESC LIMIT 12")
        .then((result) => result.rows);
}

function createImage({ url, username, title, description }) {
    return db
        .query(
            `
    INSERT INTO images (url, username, title, description)
    VALUES($1, $2, $3, $4) RETURNING *`,
            [url, username, title, description]
        )
        .then((result) => result.rows[0]);
}

function getImageById(id) {
    return db
        .query(
            `SELECT * , 
            (SELECT id FROM images WHERE id<$1 ORDER BY id DESC LIMIT 1) AS "next",
            (SELECT id FROM images WHERE id>$1 ORDER BY id ASC LIMIT 1) AS "previous"
            FROM images
            WHERE id = $1`,
            [id]
        )
        .then((result) => result.rows[0]);
}

function getCommentsByImageId(image_id) {
    return db
        .query("SELECT *  FROM comments WHERE image_id = $1", [image_id])
        .then((result) => result.rows);
}

function getMoreImages({ limit, lastID }) {
    return db
        .query(
            `        SELECT url, title, id, description, username, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lastID" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT $2`,
            [lastID, limit]
        )
        .then((result) => result.rows);
}

function createComment({ username, image_id, text }) {
    return db
        .query(
            `INSERT INTO comments (username, image_id, text) VALUES ($1, $2, $3) RETURNING *`,
            [username, image_id, text]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    getImages,
    createImage,
    getImageById,
    getCommentsByImageId,
    getMoreImages,
    createComment,
};
