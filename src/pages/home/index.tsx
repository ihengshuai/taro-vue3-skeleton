import { defineComponent } from "vue";
import { Button, Text, View } from "@tarojs/components";
import "./index.less";
import { useLoad } from "@tarojs/taro";
import { fetchAppData } from "@/service/modules/app.service";

export default defineComponent({
  setup() {
    useLoad(() => {
      console.log("Page loaded.");
    });

    function requestData() {
      fetchAppData().then(res => {
        console.log(res);
      });
    }

    return () => (
      <View>
        <Text>哈哈哈</Text>
        <Button onTap={requestData}>请求数据</Button>
      </View>
    );
  },
});
