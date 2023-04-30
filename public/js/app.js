import * as Vue from "./vue.js";
import Modal from "./modal.js";

Vue.createApp({
    components: {
        modal: Modal,
    },
    data() {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            selectedId: null,
            moreImages: true,
        };
    },
    methods: {
        handleSubmit() {
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("username", this.username);
            formData.append("description", this.description);
            /*  formData.append("time", this.created_at); */

            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((newImage) => {
                    /*          console.log(newImage); */
                    this.images.unshift(newImage);
                })
                .catch((error) => console.log("error", error));
        },
        handleFileChange(event) {
            this.file = event.target.files[0];
        },
        handleImageClick(image) {
            this.selectedId = image.id;
        },
        onCloseButtonClick() {
            this.selectedId = null;
            history.pushState({}, "", "/");
        },
        onMoreButtonClick() {
            let lastID = this.images[this.images.length - 1].id;
            fetch(`/more-images?limit=3&lastID=` + lastID)
                .then((response) => response.json())
                .then((nextImages) => {
                    this.images = [...this.images, ...nextImages];
                    if (!nextImages.length) {
                        this.moreImages = false;
                    }
                    const ids = nextImages.map((img) => img.id);
                    const lastIdInDb = nextImages[0].lastID;
                    const noMoreImages = ids.includes(lastIdInDb);
                    if (noMoreImages) {
                        this.moreImages = false;
                    }
                });
        },
    },
    mounted() {
        const currentID = window.location.hash.slice(1);
        if (currentID) {
            this.selectedId = currentID;
        }

        window.addEventListener("hashchange", () => {
            this.selectedId = window.location.hash.slice(1);
        });

        window.addEventListener("popstate", () => {
            this.selectedId = location.pathname.slice(1);
        });

        fetch("/images")
            .then((response) => response.json())
            .then((data) => {
                this.images = data;
            })
            .catch((error) => console.log("error", error));
    },
}).mount("main");
