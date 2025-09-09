import { MicrophoneToggle } from '@/components/embed-popup/microphone-toggle';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { useAgentControlBar } from '@/hooks/use-agent-control-bar';

interface ActionBarProps {
  onSend: (message: string) => void;
}

export function ActionBar({ onSend }: ActionBarProps) {
  const {
    micTrackRef,
    // FIXME: how do I explicitly ensure only the microphone channel is used?
    visibleControls,
    microphoneToggle,
    handleAudioDeviceChange,
  } = useAgentControlBar({
    controls: { microphone: true },
    saveUserChoices: true,
  });

  return (
    <div
      aria-label="Voice assistant controls"
      className="bg-bg1 border-separator1 relative z-20 mx-1 flex h-12 shrink-0 grow-0 items-center gap-1 rounded-full border px-1 drop-shadow-md"
    >
      <div className="flex gap-1">
        {visibleControls.microphone && (
          <MicrophoneToggle
            micTrackRef={micTrackRef}
            microphoneToggle={microphoneToggle}
            handleAudioDeviceChange={handleAudioDeviceChange}
          />
        )}
        {/* FIXME: do I need to handle the other channels here? */}
      </div>

      <ChatInput className="w-0 shrink-1 grow-1" onSend={onSend} />
    </div>
  );
}
