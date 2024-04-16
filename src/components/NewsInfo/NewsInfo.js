import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsInfo.scss';
import OpenAI from "openai";

const assistantId = "asst_ACwD1N2Pv05I9mM9Ag497vQk"; // Not a safety issue
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

function NewsInfo({ headlineTitle, onBackClick, storyUrl, setInputText, userInputVisible, promptGenerated, handleGenerate, setPromptGenerated, handleButtonAnimation }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied
    const [isLoading, setIsLoading] = useState(false);

    //=======================//
    // COPY HEADLINE FEATURE //
    //=======================//
    const copyHeadline = () => {
        const headline = document.querySelector('.news-info__headline');
        if (headline) {
            navigator.clipboard.writeText(headline.textContent)
                .then(() => {
                    setCopied(true); // Set copied to true after copy is successful
                    setTimeout(() => setCopied(false), 2000); // Reset Copy Headline after 2 seconds
                })
                .catch((error) => console.error(error));
        }
    }

    //===========================//
    // CREATE RANDOM ART FEATURE //
    //===========================//
    const handleRandomArt = async (event) => {
        console.log('handleRandomArt called');
        window.scrollTo(0, 0);
        if (userInputVisible) {
            if (event) {
                event.preventDefault(); // Check if event is defined before calling preventDefault
            }
            try {
                const generatedPrompt = await promptWithAI();
                await handleGenerate(generatedPrompt);
                handleButtonAnimation();
            } catch (error) {
                console.error('Error generating random art:', error);
            }
        }
    };

    //========================//
    // PROMPT WITH AI FEATURE //
    //========================//
    async function promptWithAI() {
        console.log('promptWithAI called');
        window.scrollTo(0, 0);
        // Check if the UserInput section is active and that the prompt is not generated
        if (userInputVisible) {
            try {
                setIsLoading(true); // Run Prompt with AI animation
                // Create a Thread
                console.log('Creating thread...');
                const thread = await openai.beta.threads.create();
                console.log('Thread created:', thread);

                // Create a Message
                console.log('Adding message to thread...');
                const messageResponse = await openai.beta.threads.messages.create(thread.id, {
                    role: "user",
                    content: `Here is the news headline: "${headlineTitle}"`
                });
                console.log('Message added to thread:', messageResponse);

                // Run the Assistant on the created thread
                console.log('Running the Assistant...');
                const runResponse = await openai.beta.threads.runs.create(thread.id, {
                    assistant_id: assistantId
                });
                console.log('Assistant run response:', runResponse);

                // Extract the assistant's instructions
                const instructions = runResponse.instructions;
                console.log('Assistant instructions:', instructions);

                // Combine the assistant's instructions with the news headline
                const combinedMessage = `${instructions}\n\n${headlineTitle}`;
                console.log('Combined message:', combinedMessage);

                // Call the OpenAI API (Assistant + headline) to generate the art style prompt
                const completionRequest = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: combinedMessage },
                        { role: "assistant", content: "prompt" }
                    ],
                    max_tokens: 300
                };

                const completionResponse = await openai.chat.completions.create(completionRequest);
                console.log('Completion response:', completionResponse);

                // Extract the response prompt from the completionResponse
                const generatedPrompt = completionResponse.choices[0].message.content;
                console.log('Generated art style prompt:', generatedPrompt);

                // Set the response prompt in the UserInput textarea
                setInputText(generatedPrompt);
                setPromptGenerated(true);
                handleButtonAnimation();
                return generatedPrompt;
            } catch (error) {
                console.error('Error prompting with AI:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    // Render the component only if headlineTitle is provided
    if (!headlineTitle) {
        return null;
    }

    return (
        <article className='news-info'>
            <div className='news-info__nav'>
                <Link className='news-info__nav-back' onClick={onBackClick}>🢠 Back to Headlines</Link>
                <button className='news-info__nav-copy' onClick={copyHeadline}>{copied ? 'Copied!' : 'Copy Headline'} {/* Change text based on copied state */}
                    <lord-icon
                        id="news-info__img"
                        src="https://cdn.lordicon.com/pcllgpqm.json"
                        trigger="click"
                        stroke="bold"
                        colors="primary:#121331,secondary:#ef8e6d,tertiary:#ffffff">
                    </lord-icon>
                </button>
            </div>
            <h2 className='news-info__headline'>{headlineTitle}</h2>
            <section className='news-info__buttons'>
                <a href={storyUrl} className='news-info__button' target="_blank" rel="noopener noreferrer">
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/xahuqqcs.json"
                        trigger="hover"
                        stroke="bold"
                        state="hover-rotate-up-to-down"
                        colors="primary:#121331,secondary:#ef8e6d">
                    </lord-icon>
                    <p className='news-info__p'>View Story</p>
                </a>
                <button className='news-info__button--randomize' onClick={() => {
                    handleRandomArt();
                    handleButtonAnimation(); // Call the handleButtonAnimation function here
                }} disabled={!userInputVisible || promptGenerated}>
                    <lord-icon
                        id="news-info__img-button--randomize"
                        src="https://cdn.lordicon.com/pbhjpofq.json"
                        trigger="morph"
                        state="morph-sea"
                        colors="primary:#121331,secondary:#08a88a,tertiary:#4bb3fd,quaternary:#ffc738,quinary:#d59f80,senary:#242424,septenary:#f4f19c">
                    </lord-icon>
                    <p className='news-info__p'>Create a Random Artwork</p>
                </button>
                <button className='news-info__button' onClick={() => {
                    promptWithAI();
                    handleButtonAnimation(); // Call the handleButtonAnimation function here
                }} disabled={!userInputVisible || promptGenerated}>
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        delay="1500"
                        state="default">
                    </lord-icon>
                    <p className='news-info__p'>AI Prompt</p>
                </button>
            </section>
            {isLoading && (
                <div className="overlay">
                    <lord-icon
                        id="loading-icon"
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="in"
                        state="in-dynamic"
                        delay="500"
                        colors="primary:#121331,secondary:#08a88a,tertiary:#4bb3fd,quaternary:#ffc738,quinary:#d59f80,senary:#242424,septenary:#f4f19c"
                    />
                </div>
            )}
        </article>
    )
}

export default NewsInfo