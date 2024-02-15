'use server';
import OpenAI from 'openai';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const generateTextFromAudio = async (file) => {
    try {
        const transcript = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: file.get('audio'),
            response_format:"text"
        });
        return transcript;
    } catch (error) {
        console.error(error);
    }
}

export default generateTextFromAudio;
