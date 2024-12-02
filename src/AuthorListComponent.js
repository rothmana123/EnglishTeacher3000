import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AuthorListComponent({ onLogout }) {
  const [authors, setAuthors] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  // Fetch authors
  useEffect(() => {
    fetch("https://p5bev3.uc.r.appspot.com/findAllEssays")
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Delete an author
  const handleDelete = (authorName) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      fetch("https://p5bev3.uc.r.appspot.com/deleteByAuthor", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ author: authorName }).toString(),
      })
        .then((response) => {
          if (response.ok) {
            console.log(`Essays by author '${authorName}' deleted.`);
            setAuthors((prevAuthors) =>
              prevAuthors.filter((author) => author.author !== authorName)
            );
          } else {
            console.error("Failed to delete the author.");
          }
        })
        .catch((error) => console.error("Error deleting author:", error));
    }
  };

  // Sort authors
  const sortByOverallAssessmentScore = () => {
    const sortedAuthors = [...authors].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.overallAssessmentScore - b.overallAssessmentScore;
      } else {
        return b.overallAssessmentScore - a.overallAssessmentScore;
      }
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setAuthors(sortedAuthors);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        English Teacher 3000
      </h1>
      <div style={styles.container}>
        <h2 style={styles.header}>Author List</h2>
        <table style={styles.table}>
        <thead>
  <tr>
    <th style={styles.th}>Author</th>
    <th style={styles.th}>Overall Assessment Score</th>
    <th style={styles.th}>Actions</th> {/* Moved this column */}
    <th style={styles.th}>
      <button
        onClick={sortByOverallAssessmentScore}
        style={styles.sortButton}
      >
        Sort by Score ({sortOrder === "asc" ? "⬆" : "⬇"})
      </button>
    </th>
  </tr>
</thead>
          <tbody>
            {authors.map((essay) => (
              <tr key={essay.id}>
                <td style={styles.td}>
                  <Link to={`/author/${essay.id}`} style={styles.link}>
                    {essay.author}
                  </Link>
                </td>
                <td style={styles.td}>{essay.overallAssessmentScore || "N/A"}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleDelete(essay.author)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.buttonGroup}>
          <button onClick={() => navigate("/feedback")} style={styles.button}>
            Create Feedback
          </button>
          <button onClick={onLogout} style={styles.button}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    textAlign: "center",
    padding: "10px",
    border: "1px solid #ddd",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontSize: "16px",
  },
  deleteButton: {
    padding: "5px 10px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sortButton: {
    fontSize: "14px",
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    flex: "1",
    margin: "5px",
    padding: "10px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
  },
};

export default AuthorListComponent;
