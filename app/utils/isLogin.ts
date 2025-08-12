export default function isLogin(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const token = localStorage.getItem("token");
    const expiresIn = parseInt(localStorage.getItem("expiresIn") || "0", 10);
    const now = new Date().getTime();

    if (token && expiresIn) {
      if (now < expiresIn) {
        console.log("Valid token found");
        return true;
      }
      console.log("Token expired");
    }
    console.log("No valid token");
    return false;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}
