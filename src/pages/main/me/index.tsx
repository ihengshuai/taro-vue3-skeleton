import { View } from "@tarojs/components";
import { defineComponent } from "vue";
// import PageMain from "@/components/page-main";
// import { useNavigationBounding } from "@/hooks/common";

export default defineComponent({
  setup() {
    // TODO: taro对hooks支持有问题
    // useNavigationBounding({ provider: true });
    return () => (
      // <PageMain>
      <View>我的页面</View>
      // </PageMain>
    );
  },
});
