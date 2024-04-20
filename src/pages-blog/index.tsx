import { WebView } from "@tarojs/components";
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "PageBlog",
  setup() {
    const websiteURL = ref("https://blog.usword.cn");

    function onWebviewLoaded() {
      console.log("onWebviewLoaded...");
    }
    return () => <WebView src={websiteURL.value} />;
  },
});
