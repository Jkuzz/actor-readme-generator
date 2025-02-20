type ActorDataPromptInput = {
    description: string;
    currentPricingInfo: unknown;
    inputSchema: unknown;
};

const README_GUIDE = `
# Apify Actor README Guide Summary
In Apify, the README serves as a public-facing landing page for an Actor in the Apify Store.
Unlike traditional developer-focused READMEs, it aims to attract and convert users by providing clear explanations,
SEO-optimized content, and support information.

## Key Functions of a README
- SEO – Helps the Actor rank on Google, driving motivated users to the page.
- First Impression – Persuades users to try the Actor by being clear, informative, and reassuring.
- Extended Instructions – Explains complex input settings and advanced features.
- Support – Serves as a reference for troubleshooting and common issues.

## Recommended Structure
- Intro & Features – A concise summary of what the Actor does, its benefits, and key features. Highlight platform advantages and data extraction capabilities.
- Tutorial – Step-by-step instructions or a link to a detailed guide.
- Pricing – Transparency on costs, potential scraping volumes, and SEO-optimized cost-related queries.
- Input & Output Examples – Screenshots or JSON examples to clarify data structure.
- Other Actors – Promote related Actors for cross-selling.
- FAQ, Disclaimers & Support – Cover legal disclaimers, troubleshooting, user feedback, and integration possibilities.

## Formatting & SEO Best Practices
- Use Markdown with H2/H3 headings for readability and SEO benefits.
- Maintain a clear tone suited to the target audience (technical vs. non-technical users).
- Prioritize SEO-friendly keywords in headings and content (e.g., “How to scrape [site]”).
- Keep key information in the first 25% of the README for maximum user retention.
- Use images, GIFs, and videos to improve engagement and ranking.
- Clickable images & embedded YouTube videos enhance UX and increase conversions.
- Use a neutral, informative tone of voice.
- Use GitHub-flavoured Markdown.

## Optimizing for Google
- Treat the README as a landing page to rank higher in search results.
- Structure headings to align with Google’s “People Also Ask” queries.
- Incorporate relevant keywords (e.g., “scraping [site] data,” “extract data with Python”).
- Videos boost rankings, so include a short walkthrough.
`;

export const buildPrompt = (actorData: ActorDataPromptInput) => {
    // TODO: Build prompt from actor data

    const actorMoreData = {
        description: actorData.description,
        currentPricingInfo: actorData.currentPricingInfo,
    };

    return `Generate a README for an Apify Actor. Here is a summary of a guide on writing a good README.\n${
        README_GUIDE
    }\nHere is the Actor's input schema:\n${
        JSON.stringify(actorData.inputSchema)
    }\nHere are some more details about the actor\n${
        JSON.stringify(actorMoreData)
    }`;
};
