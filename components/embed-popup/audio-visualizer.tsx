import { AnimatePresence, motion } from 'motion/react';
import { type AgentState, BarVisualizer, type TrackReference } from '@livekit/components-react';
import { useDelayedValue } from '@/hooks/useDelayedValue';
import { cn } from '@/lib/utils';

const TILE_TRANSITION = {
  type: 'spring',
  stiffness: 675,
  damping: 75,
  mass: 1,
};

interface AudioVisualizerProps {
  agentState: AgentState;
  audioTrack?: TrackReference;
  videoTrack?: TrackReference;
}

export function AudioVisualizer({ agentState, audioTrack, videoTrack }: AudioVisualizerProps) {
  // wait for the possible video track
  // FIXME: pass IO expectations upfront to avoid this delay
  const isAgentConnected = useDelayedValue(
    agentState !== 'disconnected' && agentState !== 'connecting' && agentState !== 'initializing',
    500
  );

  return (
    <AnimatePresence>
      {!videoTrack && (
        <motion.div
          key="audio-visualizer"
          className={cn(
            'bg-bg2 dark:bg-bg1 pointer-events-none absolute z-10 flex aspect-[1.5] w-64 items-center justify-center rounded-2xl border border-transparent transition-colors',
            isAgentConnected && 'bg-bg1 border-separator1 drop-shadow-2xl'
          )}
          initial={{
            scale: 1,
            left: '50%',
            top: '50%',
            translateX: '-50%',
            translateY: '-50%',
            transformOrigin: 'center top',
          }}
          animate={{
            scale: isAgentConnected ? 0.4 : 1,
            top: isAgentConnected ? '12px' : '50%',
            translateY: isAgentConnected ? '0' : '-50%',
          }}
          transition={{ TILE_TRANSITION }}
        >
          <BarVisualizer
            barCount={5}
            state={agentState}
            trackRef={audioTrack}
            options={{ minHeight: 5 }}
            className="flex h-full w-auto items-center justify-center gap-3"
          >
            <span
              className={cn([
                'bg-muted min-h-6 w-6 rounded-full',
                'origin-center transition-colors duration-250 ease-linear',
                'data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted',
              ])}
            />
          </BarVisualizer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
