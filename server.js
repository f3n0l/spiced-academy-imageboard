const path = require("path");
const express = require("express");
const app = express();

const {
    getImages,
    createImage,
    getImageById,
    getCommentsByImageId,
    getMoreImages,
    createComment,
} = require("./db");

const { Bucket, s3Upload } = require("./s3");
const { uploader } = require("./uploader");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/upload", uploader.single("file"), s3Upload, (request, response) => {
    const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
    console.log("POST /upload", url);

    createImage({
        ...request.body,
        url,
    })
        .then((newImage) => {
            response.json(newImage);
        })
        .catch((error) => {
            console.log("POST /upload", error);
            response.statusCode(500).json({ message: "error uploading image" });
        });
});

app.get("/images", (request, response) => {
    getImages().then((results) => {
        response.json(results);
    });
});

app.get("/images/:id", (request, response) => {
    getImageById(request.params.id).then((results) => {
        if (!results) {
            response.json(null);
            return;
        }
        console.log(results);
        response.json(results);
    });
});

app.get("/images/:image_id/comments", (request, response) => {
    const image_id = request.params.image_id;
    getCommentsByImageId(image_id).then((comments) => {
        response.json(comments);
    });
});

app.post("/images/:image_id/comments", (request, response) => {
    createComment({
        ...request.body,
        ...request.params,
    }).then((comment) => {
        console.log(comment);
        response.json(comment);
    });
});

app.get("/more-images", (request, response) => {
    getMoreImages(request.query)
        .then((newImages) => {
            response.json(newImages);
        })
        .catch((error) => {
            console.log("GET comments/:image_id", error);
            response.sendStatus(500);
        });
});

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log(`I'm listening.`));
