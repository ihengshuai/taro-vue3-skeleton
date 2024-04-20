import type { Ref, PropType } from "vue";
import { defineComponent, inject } from "vue";
import { CUSTOM_NAVIGATION_VARS_KAY } from "@/constants/vue-provider-keys";
import { computed } from "vue";
import { useConfig } from "@/config";
import { ref } from "vue";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
const { __isH5__ } = useConfig();

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
    fixed: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    homeUrl: {
      type: String,
      default: null,
    },
    showHeaderLeftMenu: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const isTopStackPage = ref(Taro.getCurrentPages().length === 1);
    const navigationCls = computed(() => {
      return {
        // eslint-disable-next-line camelcase
        layout__navigation: true,
        "layout__navigation--fixed": props.fixed,
        h5: __isH5__,
      };
    });
    const customBarVars = inject<Ref<Record<string, string>> | null>(CUSTOM_NAVIGATION_VARS_KAY, null);

    const navigationStyle = computed(() => {
      const joinVars2Str = Object.keys(props.customBarStyleVars || customBarVars?.value).reduce((acc, key) => {
        acc += `${key}: ${props.customBarStyleVars?.[key] || customBarVars?.value[key]};`;
        return acc;
      }, `${props.customHeaderCssStyle};`);
      return joinVars2Str;
    });

    function clickNavigationLeftMenu() {
      if (isTopStackPage.value) {
        props.homeUrl &&
          Taro.reLaunch({
            url: props.homeUrl,
          });
      } else {
        Taro.navigateBack();
      }
    }
    return () => (
      <View
        class={navigationCls.value}
        style={navigationStyle.value}
      >
        <View class="layout__navigation__bar"></View>
        <View class="layout__navigation__body">
          <View class="layout__navigation__left">
            <View
              v-if="showHeaderLeftMenu && !!homeUrl"
              class="layout__navigation__back"
            >
              {/* <u-icon
              :name="isTopStackPage ? 'home' : 'arrow-left'"
              class="layout__navigation__back__menu"
              @click="() => clickNavigationLeftMenu()"
            /> */}
            </View>
          </View>
          <view class="layout__navigation__title">
            <text>{props.title}</text>
          </view>
          <view class="layout__navigation__right" />
        </View>
      </View>
    );
  },
});
