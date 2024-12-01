import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AuthorDetailComponent() {
  const { id } = useParams();
  const [authorData, setAuthorData] = useState(null);

  // Fetch author details by ID
  useEffect(() => {
    fetch(`https://p5bev3.uc.r.appspot.com/findAllEssays`)
      .then((response) => response.json())
      .then((data) => {
        const selectedAuthor = data.find((essay) => essay.id.toString() === id);
        setAuthorData(selectedAuthor);
      })
      .catch((error) => console.error("Error fetching author data:", error));
  }, [id]);

  if (!authorData) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div>
    {/* Header at the top */}
    <h1 style={{ textAlign: 'center', marginTop: '20px' }}>English Teacher 3000</h1>
   
    <div style={styles.container}>
      <h2 style={styles.header}>{authorData.author}</h2>
      <div style={styles.detailGroup}>
        <p>
          <strong>Essay Text:</strong> {authorData.text}
        </p>
        <p>
          <strong>Feedback:</strong> {authorData.feedback}
        </p>
        <p>
          <strong>Student ID:</strong> {authorData.studentID}
        </p>
        <p>
          <strong>Overall:</strong> {authorData.overall}
        </p>
        <p>
          <strong>Lead:</strong> {authorData.lead}
        </p>
        <p>
          <strong>Transitions:</strong> {authorData.transitions}
        </p>
        <p>
          <strong>Ending:</strong> {authorData.ending}
        </p>
        <p>
          <strong>Organization:</strong> {authorData.organization}
        </p>
        <p>
          <strong>Overall Assessment:</strong> {authorData.overallAssessment}
        </p>
      </div>
      <div style={styles.scoreGroup}>
        <h3 style={styles.subHeader}>Scores</h3>
        <ul style={styles.list}>
          <li>Lead: {authorData.leadScore}</li>
          <li>Transitions: {authorData.transitionsScore}</li>
          <li>Ending: {authorData.endingScore}</li>
          <li>Organization: {authorData.organizationScore}</li>
          <li>Overall: {authorData.overallAssessmentScore}</li>
        </ul>
      </div>
      <button onClick={() => window.history.back()} style={styles.button}>
        Back to List
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
  detailGroup: {
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  subHeader: {
    color: "#333",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    lineHeight: "1.6",
  },
  scoreGroup: {
    marginBottom: "20px",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
};

export default AuthorDetailComponent;
