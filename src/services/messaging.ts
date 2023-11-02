import { useAuth } from '@/store/global';
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from './supabase';

const directMessageKey = (counterpartId: string) => [
  'whiteboardapp/direct-messages',
  counterpartId,
];

export const enum DirectMessageDirection {
  INGOING = 'INGOING',
  OUTGOING = 'OUTGOING',
}

export interface BaseMessage {
  content: string;
  created_at: string;
  sender_user_id: string;
  sender_full_name: string;
  sender_avatar_url: string;
}

export interface DirectMessage extends BaseMessage {
  direct_message_id: string;
  direction: DirectMessageDirection;
  row_number: number;
  counterpart_user_id: string;
}

/**
 * Hook for fetching direct messages between the current user and a given counterpart.
 * The counterpart is another user in the system.
 *
 * @param counterpartId the id of the counterpart user
 *
 * @returns an object containing the messages, a function for sending a new message
 *          and loading indicators
 */
export const useDirectMessages = (counterpartId: string) => {
  const { session } = useAuth();
  const qc = useQueryClient();

  /**
   * Listener effect for populating the cache with new messages
   * as they are added in the database.
   */
  useEffect(() => {
    const channel = supabase
      .channel(`direct_messages:${counterpartId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_message',
        },
        async (insertedMessage) => {
          let postedMessage: DirectMessage | null = null;

          try {
            const newMessage = await supabase
              .from('current_user_direct_messages_view')
              .select('*')
              .eq('direct_message_id', insertedMessage.new.direct_message_id)
              .single()
              .throwOnError();

            if (newMessage.data) postedMessage = newMessage.data;
          } catch (error) {
            console.warn(error);
          }

          if (postedMessage !== null) {
            qc.setQueryData(
              directMessageKey(counterpartId),
              (oldData: DirectMessage[]) => [...oldData, postedMessage]
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: directMessageKey(counterpartId),
    queryFn: async () => {
      const initialMessages = await supabase
        .from('current_user_direct_messages_view')
        .select('*')
        .eq('counterpart_user_id', counterpartId)
        .order('created_at', { ascending: true });

      return initialMessages.data as DirectMessage[];
    },
  });

  const { mutateAsync: sendMessage, isPending } = useMutation({
    mutationKey: ['whiteboardapp/direct-messages'],
    mutationFn: async (content: string) => {
      return await supabase
        .from('direct_message')
        .insert({
          content,
          fk_receiver_user_id: counterpartId,
          fk_sender_user_id: session?.user.id,
        })
        .throwOnError();
    },
  });

  // @ts-ignore
  const variables: string[] = useMutationState({
    filters: {
      mutationKey: ['whiteboardapp/direct-messages'],
      status: 'pending',
    },
    select: (mut) => mut.state.variables,
  });

  return {
    messages: data,
    isLoading,
    sendMessage,
    isSending: isPending,
    messagesBeingSent: variables,
  };
};

export interface CourseBoardMessage extends BaseMessage {
  course_board_message_id: string;
}

/**
 * Hook for fetching messages from a course board.
 *
 * @param boardId the id of the course board
 *
 * @returns an object containing the messages, a function for sending a new message
 *          and loading indicators
 */
export const useCourseBoardMessages = (boardId: string) => {
  const qc = useQueryClient();

  /**
   * Listener effect for populating the cache with new messages
   * as they are added in the database.
   */
  useEffect(() => {
    const channel = supabase
      .channel(`course_board_messages:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'course_board_message',
          filter: `fk_course_board_id=eq.${boardId}`,
        },
        async (insertedMessage) => {
          console.log(insertedMessage);

          let postedMessage: CourseBoardMessage | null = null;

          try {
            const newMessage = await supabase
              .from('course_board_message_view')
              .select('*')
              .eq(
                'course_board_message_id',
                insertedMessage.new.course_board_message_id
              )
              .single()
              .throwOnError();

            if (newMessage.data) postedMessage = newMessage.data;
          } catch (error) {
            console.warn(error);
          }

          if (postedMessage !== null) {
            qc.setQueryData(
              ['whiteboardapp/course-board-messages', boardId],
              (oldData: CourseBoardMessage[]) => [...oldData, postedMessage]
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['whiteboardapp/course-board-messages', boardId],
    queryFn: async () => {
      const initialMessages = await supabase
        .from('course_board_message_view')
        .select('*')
        .eq('fk_course_board_id', boardId)
        .order('created_at', { ascending: true });

      return initialMessages.data as CourseBoardMessage[];
    },
  });

  const { mutateAsync: sendMessage, isPending } = useMutation({
    mutationKey: ['whiteboardapp/course-board-messages'],
    mutationFn: async (content: string) => {
      return await supabase
        .rpc('current_user_post_course_board_message', {
          board_id: boardId,
          content,
          attachments: [],
        })
        .throwOnError();
    },
  });

  // @ts-ignore
  const variables: string[] = useMutationState({
    filters: {
      mutationKey: ['whiteboardapp/course-board-messages'],
      status: 'pending',
    },
    select: (mut) => mut.state.variables,
  });

  return {
    messages: data,
    isLoading,
    sendMessage,
    isSending: isPending,
    messagesBeingSent: variables,
  };
};

export interface DirectMessageThread extends DirectMessage {
  counterpart_full_name: string;
  counterpart_avatar_url: string;
}

/**
 * Hook for fetching the most recent direct message for each counterpart user.
 *
 * @returns an object containing the most recent message for each counterpart.
 */
export const useRecentDirectMessages = () => {
  return useQuery({
    queryKey: ['whiteboardapp/recent-direct-messages'],
    queryFn: async () => {
      const threads = await supabase
        .from('current_user_direct_messages_threads_view')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('row_number', 1)
        .throwOnError();

      return threads.data as DirectMessageThread[];
    },
  });
};
