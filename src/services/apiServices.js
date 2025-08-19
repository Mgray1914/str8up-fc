import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';



const excludedRoutes = [
    '/admin/login', 
];
const apiClient = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
})

// Request interceptor: Add token if available, unless in excluded routes
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const isExcluded = excludedRoutes.some((route) => config.url.includes(route));

    // Set appropriate headers
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    if (token && !isExcluded) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    toast.error("Request error! Please try again.");
    return Promise.reject(error);
  }
);

// Response interceptor: Handle global errors
apiClient.interceptors.response.use(
  (response) => {
    response.data.status = response.status
    return response.data
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong!";
      if (axios.isAxiosError(error)) {
      console.log("Error....",message)
     
      if (error?.response?.status === 401) {
       toast.error(error?.response?.data || "Your session has expired", {id:"session expired toast"})
       Cookies.remove("token");
         localStorage.clear();
         window.location.pathname = "/" 
      }else{
        console.log("first")
        toast.error(message,{id:"errorMessageToast"})
      }
    }

    console.log("API Error:", message);
    return Promise.reject(error);
  }
);

// Generic API function
export const callApi = async ({
  method,
  url,
  data = null,
  params = null,
  headers = {},
}) => {
  try {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

    const response = await apiClient({
      method,
      url,
      data,
      params,
      headers: {
        ...headers,
        ...(isFormData ? {} : {}),
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
