import { defineComponent, ref } from "vue";
import Taro, { useDidShow, navigateTo } from "@tarojs/taro";
import { Button, Camera, Text, Image, View } from "@tarojs/components";
import "./index.less";
import Counter from "@/components/Counter.vue";
// import avatar from "../../assets/img/avatar.jpg";

export default defineComponent({
  setup() {
    const showCamera = ref(false);
    const photoSrc = ref("");
    const userAvatar = ref("");
    useDidShow(() => {
      console.log("index didShow", "version: ", VERSION);
    });

    async function takePhoto() {
      const context = Taro.createCameraContext("camera");
      context.takePhoto({
        success: result => {
          console.log(result.tempImagePath);
          showCamera.value = false;
          photoSrc.value = result.tempImagePath;
          toggleOpenCamera();
        },
      });
    }

    function toggleOpenCamera() {
      showCamera.value = !showCamera.value;
    }

    function onScanCode(e) {
      console.log(e);
    }

    function go() {
      console.log("go...");
      navigateTo({
        url: "/pages/create/index",
      });
    }

    function requestData() {
      console.log("request...");
      Taro.showLoading({ title: "请稍后..." });
      Taro.request({
        url: "https://localhost:10011/api/mock/users",
        header: {
          "X-LS": "sd",
        },
        success(result) {
          console.log(result);
          Taro.hideLoading();
          Taro.showToast({ title: "请求成功" });
        },
      });
    }

    function handleLogin() {
      Taro.login({
        success: res => {
          console.log(res);
        },
      });
      Taro.getUserProfile({
        desc: "本地测试",
        success: r => {
          console.log(r);
        },
      });
    }

    // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html
    function chooseAvatar(e) {
      const avatarURL = e.detail.avatarUrl;
      userAvatar.value = avatarURL;
      // 如何保存头像
      // 获取临时的头像信息后
      // 使用uploadFile上传头像到服务器
    }

    function checkLogin() {
      Taro.checkSession({
        success: res => {
          console.log(res);
        },
      });
    }

    return () => (
      <View class="index">
        <Counter />
        <Button
          type="primary"
          onTap={go}
          class="btn"
        >
          <Text>去我的页面</Text>
        </Button>
        {/* <Image
          mode="aspectFill"
          src={avatar}
          style="width: 100%"
          preview={avatar}
          showMenuByLongpress
        /> */}
        <Button
          type="warn"
          onTap={requestData}
        >
          请求数据
        </Button>
        <Button
          openType="chooseAvatar"
          onChooseavatar={chooseAvatar}
          style="height:96px"
        >
          <Image
            style="width: 80px;height:80px;border:1px solid #ccc;border-radius: 6px;margin: 8px 0;"
            src={userAvatar.value}
          />
        </Button>
        <Button onTap={handleLogin}>登录</Button>
        <Button
          type="primary"
          onTap={checkLogin}
        >
          检查登录
        </Button>
        {showCamera.value ? (
          <>
            <Camera
              style="width: 100%; height: 300px;"
              resolution="high"
              mode="normal"
              id="camera"
            />
            <Button
              size="mini"
              onTap={takePhoto}
            >
              拍照
            </Button>
            <Button
              size="mini"
              onTap={toggleOpenCamera}
            >
              关闭
            </Button>
          </>
        ) : (
          <Button onTap={toggleOpenCamera}>打开摄像头</Button>
        )}
        {photoSrc.value && <Image src={photoSrc.value} />}
      </View>
    );
  },
});
