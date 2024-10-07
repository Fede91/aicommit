const axios = require("axios");

async function getCommitMessage(
  diff,
  branchName,
  apiKey,
  model,
  systemMessage,
  maxTokens,
  temperature,
  timeout
) {
  const prompt = `
    Write a commit message in English summarizing the following changes:
    ${diff}
    If the branch name contains an issue ID, include it in the commit message. The branch name is "${branchName}".
    Format the commit message according to git best practices.
    `;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: timeout,
    }
  );

  return response.data.choices[0].message.content.trim();
}

module.exports = { getCommitMessage };
