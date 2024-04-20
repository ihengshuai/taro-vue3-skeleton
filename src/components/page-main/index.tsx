import CustomNavigation from "@/components/custom-navigation";
import { CUSTOM_NAVIGATION_VARS_KAY } from "@/constants/vue-provider-keys";
import { Logger } from "@/utils";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { defineComponent, watchEffect } from "vue";
import { computed, inject, type PropType, type Ref } from "vue";

export default defineComponent({
  props: {
    customBarStyleVars: {
      type: Object as PropType<Record<string, string>>,
      default: null,
    },
    customHeaderCssStyle: {
      type: String,
      default: "",
    },
    /**
     * 是否固定头部
     * 需要设置 navigationStyle 为 custom
     */
    fixedHeader: {
      type: Boolean,
      default: false,
    },
    /**
     * 使用自定义头部
     * 需要设置 navigationStyle 为 custom
     */
    customHeader: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否隐藏头部，或者在页面中自定义头部
     * 需要设置 navigationStyle 为 custom
     */
    noHeader: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    class: {
      type: String,
      default: "",
    },
    showHeaderLeftMenu: {
      type: Boolean,
      default: true,
    },
    homeUrl: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: "加载中...",
    },
  },
  setup(props) {
    const customBarVars = inject<Ref<Record<string, string>> | null>(CUSTOM_NAVIGATION_VARS_KAY, null);

    if (props.customHeader && !customBarVars?.value) {
      Logger.warn(
        "【Page-Main-Component】: required provide CUSTOM_NAVIGATION_VARS_KAY, please use NavigationBounding hooks with provider!"
      );
    }

    const pageCls = computed(() => ({
      "layout__page-main": true,
      "layout__page-main--fixed-header": props.fixedHeader && props.customHeader && !props.noHeader,
      [props.class]: true,
    }));

    watchEffect(() => {
      if (props.loading) {
        return Taro.showLoading({
          title: props.loadingText,
        });
      }
      Taro.hideLoading();
    });
    return () => (
      <View
        class={pageCls.value}
        style={customBarVars?.value}
      >
        {!props.noHeader && props.customHeader && (
          <CustomNavigation
            title={props.title}
            fixed={props.fixedHeader}
            home-url={props.homeUrl}
            custom-bar-style-vars={props.customBarStyleVars}
            show-header-left-menu={props.showHeaderLeftMenu}
            custom-header-css-style={props.customHeaderCssStyle}
          />
        )}
        {/* <template v-else>
    <slot name="customHeader" />
  </template> */}

        <View class="page-main__body">
          <slot name="default" />
        </View>
      </View>
    );
  },
});

// <style lang="scss" scoped>
// .layout__page-main {
//   box-sizing: border-box;

//   &--fixed-header {
//     padding-top: var(--custom-bar-height);
//   }
// }

// // 内容区
// .layout__page-main__body {
//   padding: 16rpx;
// }
// </style>
