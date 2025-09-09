'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { type AgentState, useRoomContext, useVoiceAssistant } from '@livekit/components-react';
import { ActionBar } from '@/components/embed-popup/action-bar';
import { AudioVisualizer } from '@/components/embed-popup/audio-visualizer';
import { Transcript } from '@/components/embed-popup/transcript';
import { AvatarTile } from '@/components/livekit/avatar-tile';
import useChatAndTranscription from '@/hooks/use-chat-and-transcription';
import { useDebugMode } from '@/hooks/useDebug';
import type { EmbedErrorDetails } from '@/lib/types';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

type PopupProps = {
  disabled: boolean;
  sessionStarted: boolean;
  onEmbedError: React.Dispatch<React.SetStateAction<EmbedErrorDetails | null>>;
};

export const PopupView = ({
  disabled,
  sessionStarted,
  onEmbedError,
  ref,
}: React.ComponentProps<'div'> & PopupProps) => {
  useDebugMode();

  const room = useRoomContext();
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();

  const { messages, send } = useChatAndTranscription();

  // If the agent hasn't connected after an interval,
  // then show an error - something must not be working
  useEffect(() => {
    if (!sessionStarted) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!isAgentAvailable(agentState)) {
        const reason =
          agentState === 'connecting'
            ? 'Agent did not join the room. '
            : 'Agent connected but did not complete initializing. ';

        onEmbedError({
          title: 'Session ended',
          description: <p className="w-full">{reason}</p>,
        });
      }
    }, 10_000);

    return () => clearTimeout(timeout);
  }, [agentState, sessionStarted, room, onEmbedError]);

  return (
    <div ref={ref} inert={disabled} className="flex h-full w-full flex-col overflow-hidden">
      <div className="relative flex h-full shrink-1 grow-1 flex-col py-1">
        {/* Audio visualizer */}
        <AudioVisualizer
          agentState={agentState}
          audioTrack={agentAudioTrack}
          videoTrack={agentVideoTrack}
        />

        {/* Avatar visualizer */}
        <AnimatePresence>
          {agentVideoTrack && (
            <motion.div
              key="avatar"
              initial={{
                maskImage:
                  'radial-gradient(circle, rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) 40px, transparent 40px)',
              }}
              animate={{
                maskImage:
                  'radial-gradient(circle, rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) 500px, transparent 500px)',
              }}
              transition={{
                type: 'linear',
                duration: 1,
              }}
              className="pointer-events-none absolute inset-1 z-10 overflow-hidden rounded-[24px]"
            >
              <AvatarTile videoTrack={agentVideoTrack} className="h-full bg-black object-cover" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript */}
        <Transcript messages={messages} />

        {/* action bar */}
        <ActionBar onSend={send} />
      </div>
    </div>
  );
};
