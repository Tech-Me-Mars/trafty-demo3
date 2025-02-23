import axios from "axios";
// const config = useRuntimeConfig();
axios.defaults.baseURL = "http://localhost:7002"; //https://api-uat.mix-station.com
// axios.defaults.baseURL = "https://trafty1-api.tech-me-mars.com";

const getToken = function () {
  return localStorage.getItem("token");
};

export async function request(method, url, data, auth = true) {
  const headers = {};
  if (auth) {
    headers["Authorization"] = `Bearer ${getToken()}`;
  }
  const isloadingAxi = useState('isloadingAxi', () => true)
  isloadingAxi.value = true;
  try {
    
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    if (response) {
       isloadingAxi.value = false;
    }
    
    return response;
  } catch (error) {
    isloadingAxi.value = false;
    // Handle other errors or exceptions, if necessary
    console.error("request catch (error) ", error);

    // [[ กรณีกรอกรหัสผิด return 401]]
    if (error.response.status === 401) {
      console.log("Login รหัสผ่านผิด | Token ไม่ถูกต้อง | ไม่มี Token");
      localStorage.removeItem("token");
      await navigateTo("/auth/login");
    } else if (error.response.status === 403) {
      await navigateTo("/Unauthorized");
    } else if (error.response.status === 422) {
      console.log("ติด validate");
    } else if (error.response.status === 500) {
      console.log("catch 500");
      console.log(error.response);
    }

    throw error;
  }
}
