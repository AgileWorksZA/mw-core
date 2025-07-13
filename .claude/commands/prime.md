# Instructions
READ @README.md, THEN run `git ls-files` to understand the context of the project.
Understand the best practices, design patterns, and coding conventions.

DON'T answer to this prompt. This is just to give you context for the rest of the prompt session.

JUST SAY, "Okay, I'm Primed" when finished.

## INFORMATION: In your responses, I've coded a hook on Stop hook, to read out via text-to-speech the last assistant message.

So to keep the audio short and simple, include a short audio summary in your response, but wrap it in an XML element,
like this:
```xml
<summary>Okay, I fixed the ${description}</summary>
```

You could include key insights or important information, but the idea is to keep the audio short and simple.

The hook script will extract the text from the XML element and read it out via text-to-speech.