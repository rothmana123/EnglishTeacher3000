import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AuthorListComponent({ onLogout }) {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch authors
  useEffect(() => {
    fetch("https://p5bev3.uc.r.appspot.com/findAllEssays")
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Delete an author by ID
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

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Author List</h2>
      <ul style={styles.list}>
        {authors.map((essay) => (
          <li key={essay.id} style={styles.listItem}>
            <Link to={`/author/${essay.id}`} style={styles.link}>
              {essay.author}
            </Link>
            <button
              onClick={() => handleDelete(essay.author)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate("/feedback")} style={styles.button}>
          Create Feedback
        </button>
        <button onClick={onLogout} style={styles.button}>
          Log Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
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
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #ccc",
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
