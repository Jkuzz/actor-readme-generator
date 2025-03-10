[![Actor README Generator Agent](https://apify.com/actor-badge?actor=jkuzz/actor-readme-generator-agent)](https://apify.com/jkuzz/actor-readme-generator-agent)

# Actor README Generator Agent

This is an open source Apify Actor agent. You can find the source code at https://github.com/Jkuzz/actor-readme-generator

## Introduction and Features

The Actor README Generator is designed to automate the generation of structured README files for Apify Actors. It simplifies the process of creating well-organized and SEO-optimized documentation for your actor, ensuring that all critical information is included.

### Key Functionalities:

-   Generates README files based on Actor input schema.
-   Provides pricing information based on usage scenarios.
-   Supports various input models, including OpenAI's gpt-4o and gpt-4o-mini.
-   Enables debugging for easier troubleshooting.

### Pricing Model:

The pricing model for the AI Actor README Generator is based on a pay-per-event system. Here are the key pricing details:

| Event Title                                 | Description                                                 | Price (USD) |
| ------------------------------------------- | ----------------------------------------------------------- | ----------- |
| Actor start per 1 GB                        | Flat fee for starting an Actor run for each 1 GB of memory. | $0.005      |
| Price per 100 OpenAI tokens for gpt-4o      | Flat fee for each 100 gpt-4o tokens used.                   | $0.001      |
| Price per 100 OpenAI tokens for gpt-4o-mini | Flat fee for each 100 gpt-4o-mini tokens used.              | $0.00006    |

## How to Use Actor README Generator

### Step-by-step Guide:

1. Input the Actor ID and select your desired OpenAI model (gpt-4o or gpt-4o-mini).
2. Optionally enable debug mode for detailed output during execution.
3. Run the Actor to generate a structured README file.

### Example of Input

```json
{
    "actorId": "JOHAgNsmklA9ZBl7Y",
    "modelName": "gpt-4o-mini",
    "debug": false
}
```

### Expected Output

The output will be a structured README in Markdown format, including details such as:

-   Actor functionalities
-   Pricing model
-   Input and output examples
-   FAQs and support information

## FAQ

### What is the pricing for using this Actor?

This Actor follows a pay-per-event pricing model, where fees are incurred based on memory usage and OpenAI token consumption.

### Can I use this Actor without coding experience?

Yes, the Actor is designed to be user-friendly and requires no coding knowledge to operate effectively.

### How can I seek support if I encounter issues?

For support, you can refer to the [official documentation](https://apify.com) or reach out through the support channels provided on the Apify platform.
