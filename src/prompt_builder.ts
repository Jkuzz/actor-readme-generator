type ActorDataPromptInput = {
    description: string;
    currentPricingInfo: unknown;
    inputSchema: unknown;
    title: string;
};

const README_GUIDE = `
1. Introduction and Features
    - Start with a brief explanation of what the Actor does and how users can quickly try it.
    - Highlight key functionalities, such as data extraction capabilities, automation steps, or platform advantages.
    - If applicable, include a table listing the primary data points the Actor can extract.
    - Emphasize how Apify's platform enhances the Actor, such as API access, scheduling, and proxy rotation.

2. Tutorial Section
    - Provide a simple, step-by-step guide on how to use the Actor.
    - Optimize headings for SEO, e.g., "How to use [Actor] to scrape [target site]."

3. Pricing Explanation
    - Clearly state the Actor’s pricing model (e.g., per result, per Compute Unit, or rental).
    - Set expectations about costs based on common usage scenarios.
    - Use SEO-friendly phrasing, such as:
        "How much does it cost to scrape [target site]?"
        "Is scraping [target site] free?"

4. Input and Output Examples
    - Display input requirements clearly, preferably as structured text or JSON.
    - Show an example of expected output in JSON format.
    - If applicable, include multiple output examples (e.g., different types of extracted data).

5. FAQ, Disclaimers, and Support
    - Include frequently asked questions, troubleshooting tips, and disclaimers.
    - Address legal concerns, API alternatives, known bugs, or limitations.
    - Direct users to support channels, feedback collection, or custom solution requests.

6. Formatting and SEO
    - Use markdown with clear H2 and H3 headings for readability and SEO benefits.
    - Optimize headers for search engine visibility, particularly in H2 and H3 tags.
    - Naturally integrate keywords like "scrape [target site]," "extract data from [platform]," and "API alternative."
    - Maintain a tone appropriate for the Actor’s target audience—technical if needed, or beginner-friendly if no coding experience is required.
    - Keep the introduction concise but engaging, as most users only read the first 25% of the README.

Constraints:
    - Do not include images or videos.
    - Use GitHub-flavoured Markdown formatting.
    - Ensure clarity, conciseness, and SEO optimization.
`;

// const EXAMPLE_ACTORS_SECTION = `
// Use one of the available tools to fetch the README from the Actor that is most similar to ${actorData.title}
// - apify/instagram-scraper
// - clockworks/free-tiktok-scraper
// - compass/Google-Maps-Reviews-Scraper
// - epctex/youtube-video-downloader
// - maxcopell/zillow-zip-search
// `;

export const buildPrompt = (actorData: ActorDataPromptInput) => {
    const actorMoreData = {
        description: actorData.description,
        currentPricingInfo: actorData.currentPricingInfo,
    };

    return `First, use one of the available tools to fetch the README from the Actor that looks the most similar to ${actorData.title}
        - apify/instagram-scraper
        - clockworks/free-tiktok-scraper
        - compass/Google-Maps-Reviews-Scraper
        - epctex/youtube-video-downloader
        - maxcopell/zillow-zip-search

    Second, use the README that you fetched, the ${actorData.title} Actor information and the
    Official README Guide to generate a new README.md for the ${actorData.title} Actor.

    The Actor information is the following;
    ${JSON.stringify(actorMoreData)}

    The Official README Guide is the following:
    ${README_GUIDE}`;
};
