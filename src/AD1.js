import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
      .catch((error) => console.error('Error fetching author data:', error));
  }, [id]);

  if (!authorData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{authorData.author}</h1>
      <p><strong>Essay Text:</strong> {authorData.text}</p>
      <p><strong>Feedback:</strong> {authorData.feedback}</p>
      <p><strong>Student ID:</strong> {authorData.studentID}</p>
      <p><strong>Overall:</strong> {authorData.overall}</p>
      <p><strong>Lead:</strong> {authorData.lead}</p>
      <p><strong>Transitions:</strong> {authorData.transitions}</p>
      <p><strong>Ending:</strong> {authorData.ending}</p>
      <p><strong>Organization:</strong> {authorData.organization}</p>
      <p><strong>Overall Assessment:</strong> {authorData.overallAssessment}</p>
      <p><strong>Scores:</strong></p>
      <ul>
        <li>Lead: {authorData.leadScore}</li>
        <li>Transitions: {authorData.transitionsScore}</li>
        <li>Ending: {authorData.endingScore}</li>
        <li>Organization: {authorData.organizationScore}</li>
        <li>Overall: {authorData.overallAssessmentScore}</li>
      </ul>
      <button onClick={() => window.history.back()}>Back to List</button>
    </div>
  );
}

export default AuthorDetailComponent;
