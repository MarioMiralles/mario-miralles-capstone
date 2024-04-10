import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewsInfo.scss';
import OpenAI from "openai";

const assistantId = "asst_ACwD1N2Pv05I9mM9Ag497vQk";
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

function NewsInfo({ headlineTitle, onBackClick, storyUrl, setInputText, userInputVisible, promptGenerated }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied
    const [isLoading, setIsLoading] = useState(false); // State variable to track Loading of Prompt with AI

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

    //========================//
    // PROMPT WITH AI FEATURE //
    //========================//
    async function promptWithAI() {
        window.scrollTo(0, 0);
        // Check if the UserInput section is active and that the prompt is not generated
        if (userInputVisible && !promptGenerated) {
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

                // Call the OpenAI API (Assitant + headline) to generate the art style prompt
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
                console.log('Art style prompt set:', generatedPrompt);
            } catch (error) {
                console.error('Error prompting with AI:', error);
            } finally {
                setIsLoading(false); // Set animation to false after the prompt is generated
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
                <Link className='news-info__nav-back' onClick={onBackClick}>⯇ Back to Headlines</Link>
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
                <a className='news-info__button--randomize'>
                    <lord-icon
                        id="news-info__img-button--randomize"
                        src="https://cdn.lordicon.com/pbhjpofq.json"
                        trigger="morph"
                        state="morph-sea"
                        colors="primary:#121331,secondary:#08a88a,tertiary:#4bb3fd,quaternary:#ffc738,quinary:#d59f80,senary:#242424,septenary:#f4f19c">
                    </lord-icon>
                    <p className='news-info__p'>Create a Random Artwork</p>
                </a>
                <a className='news-info__button' onClick={promptWithAI} disabled={!userInputVisible || promptGenerated}>
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        delay="1500"

                        state="hover-line">
                    </lord-icon>
                    <p className='news-info__p'>Prompt with AI</p>
                </a>
            </section>
            {isLoading && (
                <div className="loading-overlay">
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