import "./assets/js/nav-pills.js";
import "./assets/scss/argon-dashboard.scss";
import { ArgonButton } from "@/components";
//

export default {
  install(app) {
    // This is where you can add global components, directives, or plugins
    // For example, you could register a global component like this:
    // app.component('MyComponent', MyComponent);
    app.component("ArgonButton", ArgonButton);
  },
};
