# LLM Prompts

## Primary Prompt
Context: Team size {teamSize}, use case {useCase}, savings ${savings}
Task: Write 100-word summary for startup founder
If savings > $500: mention Credex for better rates

## Fallback Strategy
- Savings = 0: 'Great news! Your team is optimized.'
- Savings < 100: 'Small optimizations found.'
- Savings < 500: 'Good savings opportunities detected.'
- Savings >= 500: 'Significant savings! Contact Credex.'
