import { useState } from "react";
import Navbar from "../components/Navbar";

export default function CourseMaterials() {
  const [weeks, setWeeks] = useState([{ id: 1, materials: [] }]);

  const addWeek = () => {
    setWeeks([...weeks, { id: weeks.length + 1, materials: [] }]);
  };

  const addMaterial = (weekId) => {
    const name = prompt("Enter file name:");
    if (!name) return;
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId
          ? { ...w, materials: [...w.materials, name] }
          : w
      )
    );
  };

  const deleteMaterial = (weekId, index) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId
          ? { ...w, materials: w.materials.filter((_, i) => i !== index) }
          : w
      )
    );
  };

  const removeWeek = (weekId) => {
    const updated = weeks.filter((w) => w.id !== weekId);
    // Re-index weeks
    const reindexed = updated.map((w, i) => ({
      ...w,
      id: i + 1,
    }));
    setWeeks(reindexed);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar title="Course Materials" />
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          background: "white",
        }}
      >
        {weeks.map((week) => (
          <div
            key={week.id}
            style={{
              marginBottom: "20px",
              borderBottom: "1px solid black",
              paddingBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3>Week {week.id}</h3>
              <button
                onClick={() => addMaterial(week.id)}
                style={{
                  background: "lightgray",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            {week.materials.length === 0 ? (
              <p>No material posted</p>
            ) : (
              week.materials.map((mat, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <button
                    onClick={() => deleteMaterial(week.id, i)}
                    style={{
                      color: "red",
                      marginRight: "10px",
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    ✖
                  </button>
                  {mat}
                </div>
              ))
            )}

            {/* Remove Week Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => removeWeek(week.id)}
                style={{
                  background: "green",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove Week
              </button>
            </div>
          </div>
        ))}

        {/* Add Week Button */}
        <button
          onClick={addWeek}
          style={{
            background: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Week
        </button>
      </div>
    </div>
  );
}

