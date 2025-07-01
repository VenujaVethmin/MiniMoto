import Cookies from "js-cookie";

export const logOut = async (router) => {
  try {
    // Remove the token from cookies
    Cookies.remove("token");

    // Redirect to login
    router.push("/auth/signin");
  } catch (error) {
    console.error("Error logging out:", error);
    // Ensure the token is removed from cookies
    Cookies.remove("token");
    router.push("/auth/signin");
  }
};
