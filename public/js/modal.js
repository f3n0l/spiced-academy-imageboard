import commentsList from "./comments-list.js";

const Modal = {
    props: ["id"],
    components: {
        "comments-list": commentsList,
    },
    data() {
        return {
            title: "",
            username: "",
            description: "",
            url: "",
            next: "",
            previous: "",
            /*             created_at: "", */
        };
    },
    /*     computed: {
        formattedDate() {
            const date = new Date(this.created_at);
            return date.toLocaleString();
        },
    }, */
    methods: {
        onCloseButtonClick() {
            this.$emit("close");
        },
        nextImage() {
            this.$emit("click", this.next);
        },
        previousImage() {
            this.$emit("click", this.previous);
        },
    },
    mounted() {
        fetch(`/images/${this.id}`)
            .then((response) => response.json())
            .then((response) => {
                if (!response) {
                    this.$emit("close");
                    history.replaceState({}, "", "/");
                    return;
                }
                this.title = response.title;
                this.username = response.username;
                this.description = response.description;
                this.url = response.url;
                this.next = response.next;
                this.previous = response.previous;
            });
    },
    template: `
    <div class="modal">
    <div class="modalcontent">

          <a class="arrow skipper" v-if="previous" :href="'#' + previous">Previous</a>
       <a class="arrow skipper" v-if="next" :href="'#' + next">Next</a>
        <h2>#{{ id }} <br> {{title}}</h2> 
        <div> <img v-if="url" v-bind:src="url"/></div>
        <div>{{description}}</div>
        <div>-by {{username}}</div>

        <div class="closebutton" v-on:click="onCloseButtonClick"> X</div>
        <comments-list :id="id"></comments-list>
    </div>
    </div>
    `,
};

export default Modal;

//        <p>{{ formattedDate }}</p>
