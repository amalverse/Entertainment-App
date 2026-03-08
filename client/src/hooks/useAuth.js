import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, token, loading } = useSelector((state) => state.auth);

  return {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
  };
};

export default useAuth;
