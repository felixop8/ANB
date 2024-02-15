import AudioTranscriber from './components/AudioTranscriber/AudioTranscriber';
import Chatbot from './components/Chatbot/Chatbot';

export default function Home() {
  return (
    <main>
      <AudioTranscriber />
      <Chatbot />
    </main>
  );
}
