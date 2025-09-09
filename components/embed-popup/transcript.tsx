import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { cn } from '@/lib/utils';

const ChatEntryMotion = motion.create(ChatEntry);

interface TranscriptProps {
  messages: ReceivedChatMessage[];
}

export function Transcript({ messages }: TranscriptProps) {
  const transcriptRef = useRef<HTMLDivElement>(null);

  // auto scroll transcript
  useEffect(() => {
    function scrollToBottom() {
      const scrollingElement = transcriptRef.current;

      if (scrollingElement) {
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
      }
    }

    if (transcriptRef.current) {
      const resizeObserver = new ResizeObserver(scrollToBottom);

      resizeObserver.observe(transcriptRef.current);
      scrollToBottom();

      return () => resizeObserver.disconnect();
    }
  }, [messages]);

  return (
    <div
      ref={transcriptRef}
      className={cn(
        'scrollbar-on-hover flex flex-1 flex-col overflow-x-hidden overflow-y-scroll py-2 pl-1',
        '[mask-image:linear-gradient(0deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,1)_5%,rgba(0,0,0,1)_95%,rgba(0,0,0,0)_100%)]'
      )}
    >
      <div className="flex flex-1 flex-col justify-end gap-2 pt-12">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatEntryMotion
              hideName
              key={message.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 1, height: 'auto', translateY: 0.001 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              entry={message}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
