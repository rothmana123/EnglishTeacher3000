// try {
  //   // Parse response (assuming a structured format)
  //   const sections = response.split("\n\n"); // Separate sections by double newlines

  //   sections.forEach((section) => {
  //     if (section.includes("Overall:")) {
  //       feedbackParts.overall = section.split("Score:")[0].replace("Overall:", "").trim();
  //       feedbackParts.overallAssessmentScore = parseInt(
  //         section.split("Score:")[1]?.trim() || "0",
  //         10
  //       );
  //     } else if (section.includes("Lead:")) {
  //       feedbackParts.lead = section.split("Score:")[0].replace("Lead:", "").trim();
  //       feedbackParts.leadScore = parseInt(
  //         section.split("Score:")[1]?.trim() || "0",
  //         10
  //       );
  //     } else if (section.includes("Transitions:")) {
  //       feedbackParts.transitions = section.split("Score:")[0].replace("Transitions:", "").trim();
  //       feedbackParts.transitionsScore = parseInt(
  //         section.split("Score:")[1]?.trim() || "0",
  //         10
  //       );
  //     } else if (section.includes("Ending:")) {
  //       feedbackParts.ending = section.split("Score:")[0].replace("Ending:", "").trim();
  //       feedbackParts.endingScore = parseInt(
  //         section.split("Score:")[1]?.trim() || "0",
  //         10
  //       );
  //     } else if (section.includes("Organization:")) {
  //       feedbackParts.organization = section.split("Score:")[0].replace("Organization:", "").trim();
  //       feedbackParts.organizationScore = parseInt(
  //         section.split("Score:")[1]?.trim() || "0",
  //         10
  //       );
  //     } else if (section.includes("Overall Assessment:")) {
  //       feedbackParts.overallAssessment = section
  //         .split("Score:")[0]
  //         .replace("Overall Assessment:", "")
  //         .trim();
  //       feedbackParts.overallAssessmentScore = parseInt(
  //         section.split("Score:")[1]?.trim() || "0",
  //         10
  //       );
  //     }
  //   });