import { createApp } from "vue";
import App from "./App.vue";
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";
import "font-awesome/css/font-awesome.min.css";

const app = createApp(App);

new WaveUI(app, {
  // Some Wave UI options.
});

app.mount("#app");
