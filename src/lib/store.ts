import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat, Message, UserSubscription } from './types';
import { createChatCompletion } from './openai';
import { addHistoryItem } from './history';
import { useAuth } from './auth';
import { updateTokenUsage } from './subscription';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface AppState {
  chats: Chat[];
  currentChatId: number | null;
  apiKey: string | null;
  subscription: UserSubscription | null;
  addChat: () => void;
  addMessage: (chatId: number, content: string, isUser: boolean) => Promise<void>;
  setCurrentChat: (chatId: number | null) => void;
  setApiKey: (key: string | null) => void;
  setSubscription: (subscription: UserSubscription | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      apiKey: null,
      subscription: null,

      addChat: () =>
        set((state) => {
          const newChat: Chat = {
            id: Date.now(),
            title: 'New Chat',
            messages: [],
            model: 'gpt-3.5-turbo',
            tokensUsed: 0,
            lastActive: new Date().toISOString(),
          };
          return {
            chats: [...state.chats, newChat],
            currentChatId: newChat.id,
          };
        }),

      addMessage: async (chatId, content, isUser) => {
        const { subscription } = get();
        const tokenLimit = subscription?.tokenLimit || 10000;

        if (!subscription || subscription.tokensUsed >= tokenLimit) {
          throw new Error(
            `Monthly token limit (${tokenLimit.toLocaleString()}) reached. Please upgrade your plan for more tokens.`
          );
        }

        const timestamp = new Date().toISOString();
        const newMessage: Message = {
          id: Date.now(),
          content,
          isUser,
          timestamp,
        };

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
          ),
        }));

        if (isUser) {
          const startTime = Date.now();
          const chat = get().chats.find((c) => c.id === chatId);
          if (!chat) return;

          const messages: ChatCompletionMessageParam[] = chat.messages.map((msg) => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content,
          }));

          messages.push({ role: 'user', content });

          try {
            const response = await createChatCompletion(messages, {
              model: chat.model,
              apiKey: get().apiKey,
            });

            const responseTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

            const user = useAuth.getState().user;
            if (user) {
              await updateTokenUsage(user.id, response.tokensUsed);
              // Update local subscription state with new token usage
              const updatedSubscription = {
                ...get().subscription!,
                tokensUsed: (get().subscription?.tokensUsed || 0) + response.tokensUsed,
              };
              set({ subscription: updatedSubscription });
            }

            const aiMessage: Message = {
              id: Date.now(),
              content: response.content,
              isUser: false,
              timestamp: new Date().toISOString(),
            };

            set((state) => ({
              chats: state.chats.map((c) =>
                c.id === chatId
                  ? {
                      ...c,
                      messages: [...c.messages, aiMessage],
                      tokensUsed: c.tokensUsed + response.tokensUsed,
                      lastActive: aiMessage.timestamp,
                    }
                  : c
              ),
            }));

            if (user) {
              const historyItem = {
                user_id: user.id,
                type: 'chat' as const,
                model: response.model,
                title: `Chat Completion - ${response.tokensUsed} tokens`,
                tokens_used: response.tokensUsed,
                response_time: responseTime,
                status: response.status,
                messages: chat.messages,
                prompt: content,
                completion: response.content,
              };

              try {
                await addHistoryItem(historyItem);
              } catch (error) {
                console.error('Failed to save to history:', error);
              }
            }
          } catch (error) {
            set((state) => ({
              chats: state.chats.map((chat) =>
                chat.id === chatId ? { ...chat, messages: chat.messages.slice(0, -1) } : chat
              ),
            }));
            throw error;
          }
        }
      },

      setCurrentChat: (chatId) => set({ currentChatId: chatId }),

      setApiKey: (apiKey) => set({ apiKey }),

      setSubscription: (subscription) => set({ subscription }),
    }),
    {
      name: 'ai-dashboard-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        chats: state.chats,
      }),
    }
  )
);
