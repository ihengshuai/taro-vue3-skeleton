import { defineComponent } from "vue";
import { useDidShow } from "@tarojs/taro";
import { View, Text, Map } from "@tarojs/components";

export default defineComponent({
  setup() {
    useDidShow(() => console.log("me show..."));

    return () => (
      <View>
        <Map style="width:100%;height:100vh" />
      </View>
    );
  },
});
