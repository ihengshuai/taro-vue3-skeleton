import { Text, View } from "@tarojs/components";
import { defineComponent, ref } from "vue";
// import PageMain from "@/components/page-main";
// import { useNavigationBounding } from "@/hooks/common";

export default defineComponent({
  setup() {
    // TODO: taro对hooks支持有问题
    // useNavigationBounding({ provider: true });

    const nowDate = ref();
    const str = ref();

    // __non_webpack_require__ 没法包装
    __non_webpack_require__ &&
      __non_webpack_require__("~/package-moment/index.js", res => {
        console.log("moment加载成功,", res);
        nowDate.value = res.formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
      });

    __non_webpack_require__ &&
      __non_webpack_require__("~/package-crypto/index.js", res => {
        str.value = res.MD5("hello world");
      });

    return () => (
      // <PageMain>
      <View>
        <View style="margin: 100px 0;font-size: 48rpx;text-align: center;color: salmon;">
          <Text>当前页使用了异步分包</Text>
        </View>
        <Text>当前时间: {nowDate.value}</Text>
        <View />
        <Text>md5编码: {str.value}</Text>
      </View>
      // </PageMain>
    );
  },
});
