type ActorDataPromptInput = {
    description?: string;
    currentPricingInfo: unknown;
    inputSchema: unknown;
    title?: string;
};

const README_GUIDE = `
Introduction and Features
    - Start with a brief explanation of what the Actor does and how users can quickly try it.
    - Highlight key functionalities, such as data extraction capabilities, automation steps, or platform advantages.
    - If applicable, include a table listing the primary data points the Actor can extract.
    - Emphasize how Apify's platform enhances the Actor, such as API access, scheduling, and proxy rotation.

Tutorial Section
    - Provide a simple, step-by-step guide on how to use the Actor.
    - Optimize headings for SEO, e.g., "How to use [Actor] to scrape [target site]."

Pricing Explanation
    - Clearly state the Actor’s pricing model (e.g., per result, per Compute Unit, or rental).
    - Set expectations about costs based on common usage scenarios.
    - Use SEO-friendly phrasing, such as:
        "How much does it cost to scrape [target site]?"
        "Is scraping [target site] free?"

Input and Output Examples
    - Display input requirements clearly, preferably as structured text or JSON.
    - Show an example of expected output in JSON format.
    - If applicable, include multiple output examples (e.g., different types of extracted data).

FAQ, Disclaimers, and Support
    - Include frequently asked questions, troubleshooting tips, and disclaimers.
    - Address legal concerns, API alternatives, known bugs, or limitations.
    - Direct users to support channels, feedback collection, or custom solution requests.

Formatting and SEO
    - Use markdown with clear H2 and H3 headings for readability and SEO benefits.
    - Optimize headers for search engine visibility, particularly in H2 and H3 tags.
    - Naturally integrate keywords like "scrape [target site]," "extract data from [platform]," and "API alternative."
    - Maintain a tone appropriate for the Actor’s target audience—technical if needed, or beginner-friendly if no coding experience is required.
    - Keep the introduction concise but engaging, as most users only read the first 25% of the README.
    - Use some emojis to make the README more engaging.

Constraints:
    - Do not include images or videos.
    - Do not escape any characters, even in code blocks.
    - Use GitHub-flavoured Markdown formatting.
    - Ensure clarity, conciseness, and SEO optimization.
    - The README must only contain information obtained from the input schema or the description of the Actor.
    - The output must not contain any information outside of scope of the Actor.
`;

export const buildPrompt = (actorData: ActorDataPromptInput, datasetData: string[]) => {
    const actorMoreData = {
        description: actorData.description,
        currentPricingInfo: actorData.currentPricingInfo,
    };

    return `Generate a structured README for this Apify Actor ${actorData.title}.
    This is information about the Actor:
    ${JSON.stringify(actorMoreData)}
    This is the input schema of the Actor:
    ${JSON.stringify(actorData.inputSchema)}
    This are some of the fields available on the Actor output:
    ${datasetData}
    Summarise the actor's source code and use it to generate a README.
    Use one of the available tools to fetch the README from the Actor that looks the most similar to ${actorData.title}.
    Here are some examples of Actors with a good READMEs:
        - apify/instagram-scraper
        - clockworks/free-tiktok-scraper
        - compass/Google-Maps-Reviews-Scraper
        - epctex/youtube-video-downloader
        - maxcopell/zillow-zip-search

    This is the Official README Guide:
    ${README_GUIDE}`;
};
