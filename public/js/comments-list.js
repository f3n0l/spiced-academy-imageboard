/* import { text } from "express";
 */
const CommentsList = {
    props: ["id"],
    data() {
        return { comments: [], text: "", username: "" };
    },
    mounted() {
        fetch(`/images/${this.id}/comments`)
            .then((response) => response.json())
            .then((comments) => {
                this.comments = comments;
            });
    },
    methods: {
        onFormSubmit(event) {
            event.preventDefault();
            fetch(`/images/${this.id}/comments`, {
                method: "POST",
                body: JSON.stringify({
                    username: this.username,
                    text: this.text,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((newComment) => {
                    console.log(newComment);
                    this.comments.push(newComment);
                    this.username = "";
                    this.text = "";
                })
                .catch((error) => console.log("error", error));
        },
    },
    template: `
    <div>
    <div class="comments">
    <h2>Comments</h2>
    <article class="comment" v-for= "comment in comments">"{{comment.text}}" - {{comment.username}} </article>
    </div>
        <form v-on:submit="onFormSubmit">
    <input  name="username" required
                    type="text" 
                    placeholder="username"
                    v-model="username">
    <input  name="text" required
                    type="text" 
                    placeholder="text"
                    v-model="text">
    <button class="arrow" type="submit">Send Comment</button>
    </form>
    </div>
    `,
};

export default CommentsList;
