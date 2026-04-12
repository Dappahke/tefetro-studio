'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Search,
  Check,
  CheckCheck,
  Clock,
  HardHat,
  ShoppingBag,
  Plus,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Conversation {
  id: string;
  type: 'project' | 'order' | 'general';
  name: string;
  subtitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  read: boolean;
  isMe: boolean;
}

// Throttle utility
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setUserId(user.id);

        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_time', { ascending: false });

        if (error) {
          console.error('Error fetching conversations:', error);
          return;
        }

        const formattedConversations: Conversation[] = (data || []).map(conv => ({
          id: conv.id,
          type: conv.type,
          name: conv.name,
          subtitle: conv.subtitle,
          lastMessage: conv.last_message || 'No messages yet',
          lastMessageTime: formatTimeAgo(conv.last_message_time),
          unreadCount: conv.unread_count || 0,
          online: true // This would come from a presence system
        }));

        setConversations(formattedConversations);
        
        if (formattedConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(formattedConversations[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [supabase]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const formattedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.sender_id === user?.id ? 'You' : 'Tefetra Team',
        content: msg.content,
        timestamp: msg.created_at,
        type: msg.type,
        fileUrl: msg.file_url,
        fileName: msg.file_name,
        fileSize: msg.file_size,
        read: msg.read,
        isMe: msg.sender_id === user?.id
      }));

      setMessages(formattedMessages);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', selectedConversation)
        .eq('read', false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation:${selectedConversation}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
        (payload) => {
          const newMessage = payload.new as any;
          setMessages(prev => [...prev, {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            senderName: newMessage.sender_id === userId ? 'You' : 'Tefetra Team',
            content: newMessage.content,
            timestamp: newMessage.created_at,
            type: newMessage.type,
            fileUrl: newMessage.file_url,
            fileName: newMessage.file_name,
            fileSize: newMessage.file_size,
            read: newMessage.read,
            isMe: newMessage.sender_id === userId
          }]);
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.userId !== userId) {
          setTypingUser(payload.payload.userId);
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, 3000);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [selectedConversation, userId, supabase]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !userId) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: userId,
          content: messageInput,
          type: 'text',
          read: false
        });

      if (error) throw error;

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message: messageInput,
          last_message_time: new Date().toISOString()
        })
        .eq('id', selectedConversation);

      setMessageInput('');
      setIsTyping(false);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const throttledTypingEvent = useRef(
    throttle(() => {
      if (!channelRef.current) return;
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId }
      });
    }, 3000)
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.length > 0) {
      throttledTypingEvent();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'project': return <HardHat className="w-5 h-5 text-sage" />;
      case 'order': return <ShoppingBag className="w-5 h-5 text-tefetra" />;
      default: return <MessageSquare className="w-5 h-5 text-deep" />;
    }
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-tefetra" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-deep">Messages</h1>
          <p className="text-stone-600 mt-1">Communicate with your project team</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 glass rounded-2xl overflow-hidden flex min-h-0">
        {/* Sidebar - Conversation List */}
        <div className={`w-full sm:w-80 border-r border-stone-200 flex flex-col ${showMobileChat ? 'hidden sm:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-stone-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tefetra/50"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">No conversations yet</p>
                <Link href="/dashboard/messages/new" className="btn-primary text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Conversation
                </Link>
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    setShowMobileChat(true);
                  }}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-stone-50 transition-colors border-b border-stone-50 ${
                    selectedConversation === conversation.id ? 'bg-tefetra/5 border-l-4 border-l-tefetra' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep to-sage flex items-center justify-center text-white font-bold">
                      {conversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    {conversation.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-deep truncate">{conversation.name}</h3>
                      <span className="text-xs text-stone-400 whitespace-nowrap">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-stone-500 truncate">{conversation.subtitle}</p>
                    <p className="text-sm text-stone-600 mt-1 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-tefetra text-white text-xs font-bold rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${showMobileChat ? 'flex' : 'hidden sm:flex'}`}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowMobileChat(false)}
                    className="sm:hidden p-2 -ml-2 hover:bg-stone-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-600" />
                  </button>
                  
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep to-sage flex items-center justify-center text-white font-bold">
                      {currentConversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    {currentConversation.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-deep">{currentConversation.name}</h3>
                    <p className="text-xs text-stone-500">
                      {isTyping ? (
                        <span className="text-tefetra flex items-center gap-1">
                          typing
                          <span className="flex gap-0.5">
                            <span className="w-1 h-1 bg-tefetra rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-tefetra rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-tefetra rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        </span>
                      ) : (
                        'Online'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-stone-100 rounded-lg text-stone-600">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-stone-100 rounded-lg text-stone-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                      <p className="text-stone-500">No messages yet</p>
                      <p className="text-sm text-stone-400 mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, idx) => {
                    const showAvatar = !message.isMe && (idx === 0 || messages[idx - 1].senderId !== message.senderId);
                    
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.isMe ? 'flex-row-reverse' : ''}`}>
                          {!message.isMe && showAvatar && (
                            <div className="w-8 h-8 rounded-lg bg-deep flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {message.senderName.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          {!message.isMe && !showAvatar && <div className="w-8" />}

                          <div>
                            {!message.isMe && showAvatar && (
                              <p className="text-xs text-stone-500 mb-1 ml-1">{message.senderName}</p>
                            )}

                            <div className={`rounded-2xl px-4 py-2.5 ${
                              message.isMe 
                                ? 'bg-tefetra text-white rounded-br-md' 
                                : 'bg-white border border-stone-200 text-stone-700 rounded-bl-md'
                            }`}>
                              {message.type === 'text' && (
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              )}
                              
                              {message.type === 'file' && (
                                <div className={`flex items-center gap-3 p-2 rounded-lg ${message.isMe ? 'bg-white/20' : 'bg-stone-100'}`}>
                                  <FileText className={`w-8 h-8 ${message.isMe ? 'text-white' : 'text-deep'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                                    <p className={`text-xs ${message.isMe ? 'text-white/70' : 'text-stone-500'}`}>{message.fileSize}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className={`flex items-center gap-1 mt-1 ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className={`text-xs ${message.isMe ? 'text-white/60' : 'text-stone-400'}`}>
                                {formatTime(message.timestamp)}
                              </span>
                              {message.isMe && (
                                message.read ? (
                                  <CheckCheck className="w-3 h-3 text-white/80" />
                                ) : (
                                  <Check className="w-3 h-3 text-white/60" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-lg bg-deep flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        T
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 mb-1 ml-1">Tefetra Team</p>
                        <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-stone-100 bg-white">
                <div className="flex items-end gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 hover:bg-stone-100 rounded-xl text-stone-500 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tefetra/50 pr-12"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-stone-200 rounded-lg text-stone-400 hover:text-tefetra transition-colors">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sending}
                    className="p-3 bg-tefetra text-white rounded-xl hover:bg-tefetra-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-400 mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-tefetra/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-tefetra" />
                </div>
                <h3 className="font-bold text-deep text-lg">Select a conversation</h3>
                <p className="text-stone-500 mt-1">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}