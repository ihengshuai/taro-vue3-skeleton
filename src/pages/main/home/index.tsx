import { defineComponent, ref } from "vue";
import { Button, Text, View, Image } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import logoPng from "@/assets/img/logo.png";
import style from "./index.module.less";
import {
  fetchUserMockData,
  fetchBusinessError,
  fetchServerError,
  fetchCustomBusinessErrorHook,
} from "@/service/modules/user.service";

export default defineComponent({
  setup() {
    const loading2 = ref(false);
    const loading = ref(false);
    const serverData = ref();

    useLoad(() => {
      console.log("Page loaded.");
    });

    function requestUserMockData() {
      serverData.value = null;
      loading.value = true;
      fetchUserMockData(+new Date())
        .then(res => {
          serverData.value = res;
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          // console.log("出错了...", err.message);
          // uni.showToast({
          //   title: err.message || "出错了...",
          //   icon: "none",
          // });
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function requestBusinessErrorData() {
      fetchBusinessError();
    }
    async function requestCustomBusinessErrorHookData() {
      try {
        const res = await fetchCustomBusinessErrorHook();
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    async function requestServerErrorData() {
      loading2.value = true;
      try {
        const res = await fetchServerError();
        console.log(res);
      } catch (error: any) {
        console.log("请求出错了...", error.message);
      } finally {
        loading2.value = false;
      }
    }

    async function requestDiffCaptureError(captureError = true) {
      try {
        await fetchServerError({
          captureError,
          retryCount: 0,
        });
      } catch (err) {
        if (!captureError) {
          Taro.showToast({
            title: "请求出错了(自定义错误)...",
            icon: "none",
          });
        }
      }
    }

    function goWebviewPage() {
      Taro.navigateTo({
        url: "/pages-blog/index",
      });
    }

    return () => (
      <View class={style.content}>
        <Image
          class={style.logo}
          src={logoPng}
        />
        <View class="text-area">
          <Text class="title">title...</Text>
        </View>
        {!!serverData.value && (
          <View style="color: #999; font-size: 28rpx">
            <Text>{serverData.value}</Text>
          </View>
        )}
        <Button
          loading={loading.value}
          disabled={loading.value}
          style="width: 200rpx"
          onTap={requestUserMockData}
        >
          成功请求
        </Button>
        <Button onTap={requestBusinessErrorData}>业务状态码错误(疯狂点击取消重复请求)</Button>
        <Button onTap={requestCustomBusinessErrorHookData}>自定义业务错误钩子</Button>
        <Button
          loading={loading2.value}
          disabled={loading2.value}
          onTap={requestServerErrorData}
        >
          服务器出错(自动重试)
        </Button>
        <Button onTap={() => requestDiffCaptureError()}>全局拦截错误</Button>
        <Button onTap={() => requestDiffCaptureError(false)}>自定义错误(非全局拦截)</Button>
        <Button onTap={goWebviewPage}>打开webview</Button>
      </View>
    );
  },
});
