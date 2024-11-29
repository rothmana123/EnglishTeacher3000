import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from 'react-router-dom'; // Import useNavigate at the top


const FeedbackComponent = ({ onLogout }) => {
  const [author, setAuthor] = useState("");
  const [studentID, setStudentID] = useState("");
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const gptAPI = process.env.REACT_APP_GPT_API_KEY;


  const rubric = {
    criteria: [
      {
        name: "Overall",
        description:
          "The narrative includes realistic characters, tension, and change, and develops an idea, lesson, or theme.",
        levels: {
          "1": "Lacks realistic characters, tension, or a clear theme.",
          "2": "Some elements of tension or theme are present but not fully developed.",
          "3": "Includes realistic characters, tension, and a partially developed theme.",
          "4": "Effectively includes realistic characters, tension, and a well-developed theme.",
        },
      },
      {
        name: "Lead",
        description:
          "The beginning sets the story in motion and grounds it in a place or situation, including details that are important to the story.",
        levels: {
          "1": "Beginning lacks context or important details.",
          "2": "Sets the story in motion but lacks significant details or grounding.",
          "3": "Begins with context and details that are relevant to the story.",
          "4": "Effectively sets the story in motion with engaging details and strong grounding.",
        },
      },
      {
        name: "Transitions",
        description: "Uses transitional phrases and clauses to connect events and ideas logically.",
        levels: {
          "1": "Transitions are confusing or missing.",
          "2": "Limited use of transitional phrases.",
          "3": "Uses transitional phrases to connect events and ideas clearly.",
          "4": "Skillfully uses transitional phrases to create logical and engaging connections.",
        },
      },
      {
        name: "Ending",
        description:
          "Provides a sense of closure by showing how the character or situation has changed or how the problem has been resolved.",
        levels: {
          "1": "Lacks closure or clear resolution.",
          "2": "Provides a partial resolution or unclear sense of closure.",
          "3": "Offers a clear resolution or thoughtful reflection on the theme.",
          "4": "Provides a compelling resolution and leaves the reader with a thoughtful impact.",
        },
      },
      {
        name: "Organization",
        description:
          "Follows a narrative structure (e.g., rising action, conflict, falling action) to bring out the story's meaning.",
        levels: {
          "1": "Structure is confusing or does not align with narrative elements.",
          "2": "Basic structure with some gaps in narrative flow.",
          "3": "Follows a logical narrative structure with clear rising action and resolution.",
          "4": "Uses a traditional or modified structure that enhances the narrative’s meaning.",
        },
      },
    ],
  };

  // Handle ChatGPT API call
  const getFeedback = async () => {
    try {
      const prompt = `
        Please evaluate the following essay based on the provided rubric. 
        In seperate sections, please Provide detailed feedback for each criterion.  Start each section referencing the name of the section and the score you are giving. then give an overall assessment.

        Essay:
        ${text}

        Rubric:
         ${rubric.criteria
          .map((criterion) => {
            return `
            Criterion: ${criterion.name}
            Description: ${criterion.description}
            Levels:
            ${Object.entries(criterion.levels)
              .map(([level, description]) => `Level ${level}: ${description}`)
              .join("\n")}
          `;
          })
          .join("\n")}
      `;
      
      // Log that the ChatGPT call is being initiated
      console.log("GPT API Key:", gptAPI);
    console.log("Making API call to ChatGPT with the following prompt:");
    console.log(prompt);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${gptAPI}`,
          },
        }
      );
      // Log the response for debugging purposes
    console.log("Response received from ChatGPT:", response.data);
    setFeedback(response.data.choices[0].message.content || "Feedback received!"); // Update the feedback field with the full response


  } catch (error) {
    console.error("Error getting feedback:", error);
    alert("An error occurred while getting feedback.");
  }
};

const parseFeedback = (response) => {
  const feedbackParts = {
    overall: "",
    lead: "",
    transitions: "",
    ending: "",
    organization: "",
    overallAssessment: "",
    leadScore: 0,
    transitionsScore: 0,
    endingScore: 0,
    organizationScore: 0,
    overallAssessmentScore: 0,
  };

  try {
    // Parse response (assuming a structured format)
    const sections = response.split("\n\n"); // Separate sections by double newlines

    sections.forEach((section) => {
      if (section.includes("Overall:")) {
        feedbackParts.overall = section.split("Score:")[0].replace("Overall:", "").trim();
        feedbackParts.overallAssessmentScore = parseInt(
          section.split("Score:")[1]?.trim() || "0",
          10
        );
      } else if (section.includes("Lead:")) {
        feedbackParts.lead = section.split("Score:")[0].replace("Lead:", "").trim();
        feedbackParts.leadScore = parseInt(
          section.split("Score:")[1]?.trim() || "0",
          10
        );
      } else if (section.includes("Transitions:")) {
        feedbackParts.transitions = section.split("Score:")[0].replace("Transitions:", "").trim();
        feedbackParts.transitionsScore = parseInt(
          section.split("Score:")[1]?.trim() || "0",
          10
        );
      } else if (section.includes("Ending:")) {
        feedbackParts.ending = section.split("Score:")[0].replace("Ending:", "").trim();
        feedbackParts.endingScore = parseInt(
          section.split("Score:")[1]?.trim() || "0",
          10
        );
      } else if (section.includes("Organization:")) {
        feedbackParts.organization = section.split("Score:")[0].replace("Organization:", "").trim();
        feedbackParts.organizationScore = parseInt(
          section.split("Score:")[1]?.trim() || "0",
          10
        );
      } else if (section.includes("Overall Assessment:")) {
        feedbackParts.overallAssessment = section
          .split("Score:")[0]
          .replace("Overall Assessment:", "")
          .trim();
        feedbackParts.overallAssessmentScore = parseInt(
          section.split("Score:")[1]?.trim() || "0",
          10
        );
      }
    });
  } catch (error) {
    console.error("Error parsing feedback:", error);
  }

  return feedbackParts;
};


// Handle database submission
const submitToDatabase = async () => {
  try {
    // Parse the feedback before submission
    const parsedFeedback = parseFeedback(feedback);

    // Construct the submission payload with flat values
    const submissionData = {
      author,
      text: "",
      feedback: "", 
      studentID,
      overall: parsedFeedback.overall,
      lead: parsedFeedback.lead,
      transitions: parsedFeedback.transitions,
      ending: parsedFeedback.ending,
      organization: parsedFeedback.organization,
      overallAssessment: parsedFeedback.overallAssessment,
      leadScore: parsedFeedback.leadScore,
      transitionsScore: parsedFeedback.transitionsScore,
      endingScore: parsedFeedback.endingScore,
      organizationScore: parsedFeedback.organizationScore,
      overallAssessmentScore: parsedFeedback.overallAssessmentScore,
    };

    console.log("Submitting data to backend:", submissionData);

    // Send the flat object to the backend
    await axios.post(
      "https://p5bev3.uc.r.appspot.com/saveEssay",
      submissionData,
      { headers: { "Content-Type": "application/json" } }
    );

    alert("Submission successful!");
  } catch (error) {
    console.error("Error submitting data:", error);
    alert("An error occurred while submitting data.");
  }
};


  // Reset handler
  const handleReset = () => {
    setAuthor("");
    setStudentID("");
    setText("");
    setFeedback("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Feedback Form</h2>

      {/* Author Input */}
      <div style={styles.inputGroup}>
        <label htmlFor="author" style={styles.label}>Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Student ID Input */}
      <div style={styles.inputGroup}>
        <label htmlFor="studentID" style={styles.label}>Student ID:</label>
        <input
          type="text"
          id="studentID"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Essay Text Input */}
      <div style={styles.inputGroup}>
        <label htmlFor="text" style={styles.label}>Essay:</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ ...styles.input, height: "100px" }}
        />
      </div>

      {/* Feedback Display */}
      <div style={styles.inputGroup}>
        <label htmlFor="feedback" style={styles.label}>Feedback:</label>
        <textarea
          id="feedback"
          value={feedback}
          readOnly
          style={{ ...styles.input, height: "150px", backgroundColor: "#f9f9f9" }}
        />
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button onClick={getFeedback} style={styles.button}>
          Get Feedback
        </button>
        <button onClick={submitToDatabase} style={styles.button}>
          Submit to Database
        </button>
        <button onClick={handleReset} style={styles.button}>
          Reset
        </button>
        <button onClick={() => navigate('/')} style={styles.button}>
        Back to Author List
      </button>
        <button onClick={onLogout} style={styles.button}>
          Log Out
        </button>
      </div>
    </div>
  );
};

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
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
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

export default FeedbackComponent;
