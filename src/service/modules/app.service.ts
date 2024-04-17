import { HttpClientFrequently } from "@/utils";

const httpInstance = HttpClientFrequently.instance;
httpInstance.setUserConfig({
  baseURL: "https://localhost:10011/api/mock/global-data",
  // baseURL: "https://mockx.apifox1.com/ssdf/xxefault"
});

export async function fetchAppData() {
  return httpInstance.get("", {
    retryCount: 3,
  });
}
