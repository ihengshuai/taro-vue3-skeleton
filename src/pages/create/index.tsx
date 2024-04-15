import { defineComponent } from "vue";
import { View, Text } from "@tarojs/components";

export default defineComponent({
  setup() {
    return () => {
      return (
        <View>
          <Text>创建动态</Text>
        </View>
      );
    };
  },
});
