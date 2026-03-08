import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Helper hook to fire an action when a component mounts
const useFetchOnMount = (action) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(action());
  }, [dispatch, action]);
};

export default useFetchOnMount;
