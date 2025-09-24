import { useParams } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { useEffect, useState } from "react";

const MessSnacks = () => {
  const { roll } = useParams();
  const [snacks, setSnacks] = useState(null);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.CHECK_SNACKS_BY_ROLL(roll)
        );
        setSnacks(response.data);
      } catch (error) {
        console.error("Snacks Data Fetching Failed ", error);
      }
    };

    fetchSnacks();
  }, [roll]);

  if (!snacks) return <div>Loading...</div>;

  const opted = snacks.optedForSnacks;

  return (
    <div
      style={{
        backgroundColor: opted ? "lightgreen" : "lightcoral", // full bg color
        minHeight: "100vh", // full screen height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      <h2>Himadri Mess!!</h2>
      {opted ? (
        <div>The user {roll} has opted for snacks ✅</div>
      ) : (
        <div>The user {roll} has not opted for snacks ❌</div>
      )}
      {snacks.mess && snacks.mess.tookSnacksAt && (
        <div style={{ marginTop: "20px" }}>
          Checked at: <strong>{new Date(snacks.mess.tookSnacksAt).toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
};

export default MessSnacks;
