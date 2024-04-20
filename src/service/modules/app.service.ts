import { useConfig } from "@/config";
import { IUserInfo } from "@/typings/business/user.interceface";
import { HttpClientFrequently } from "@/utils";

const { USE_MOCK, MOCK_API, API_DOMAIN, __isDev__ } = useConfig();

const BASE_URL = __isDev__ && USE_MOCK && !!MOCK_API ? MOCK_API : API_DOMAIN;
const httpInstance = HttpClientFrequently.instance;
httpInstance.setUserConfig({ baseURL: BASE_URL });

const APP_API = {
  HOME: `/api/mock/global-data`,
};

export function fetchHomeData() {
  return httpInstance.get<IUserInfo>(APP_API.HOME, {
    label: "全局请求",
    transferToCamel: true,
    timeStamp: true,
  });
}
