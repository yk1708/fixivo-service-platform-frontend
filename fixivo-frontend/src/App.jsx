import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "./app/slices/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    dispatch(restoreAuth());
    setIsRestoring(false);
  }, [dispatch]);

  if (isRestoring) {
    return <div></div>; 
  }

  return <AppRoutes />;
}

export default App;