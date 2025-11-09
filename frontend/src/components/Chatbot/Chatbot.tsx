import { Box, CircularProgress, IconButton, Input, Sheet, Typography, useTheme } from '@mui/joy';
import { ChevronLeft, ChevronRight, MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ChatbotProps {
  resultData: {
    id: string;
    completionDate: string;
    potentialProblems: string[];
    adviceLists: { problem: string; advices: string[] }[];
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const Chatbot = ({ resultData }: ChatbotProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t('chatbot.welcome-message'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // On mobile, start closed. On tablet/desktop, start open.
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          resultContext: {
            potentialProblems: resultData.potentialProblems,
            completionDate: resultData.completionDate,
            adviceLists: resultData.adviceLists,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile: Floating button + Modal
  if (isMobile) {
    if (!isOpen) {
      return (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            size="lg"
            variant="solid"
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              boxShadow: 'lg',
              '&:hover': {
                boxShadow: 'xl',
              },
            }}
          >
            <MessageCircle size={24} />
          </IconButton>
        </Box>
      );
    }

    return (
      <Sheet
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.softBg',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageCircle size={20} />
            <Typography level="title-md">{t('chatbot.title')}</Typography>
          </Box>
          <IconButton size="sm" variant="plain" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Sheet
                variant="soft"
                color={message.role === 'user' ? 'primary' : 'neutral'}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 'lg',
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                }}
              >
                <Typography level="body-sm" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
              </Sheet>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Sheet
                variant="soft"
                color="neutral"
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 'lg',
                }}
              >
                <CircularProgress size="sm" />
              </Sheet>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatbot.input-placeholder')}
            disabled={isLoading}
            sx={{ flex: 1 }}
          />
          <IconButton type="submit" disabled={isLoading || !input.trim()}>
            <Send size={20} />
          </IconButton>
        </Box>
      </Sheet>
    );
  }

  // Tablet: Collapsible sidebar with toggle button
  if (isTablet) {
    return (
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Toggle button when closed */}
        {!isOpen && (
          <IconButton
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 10,
              boxShadow: 'sm',
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>
        )}

        {/* Collapsible sidebar */}
        {isOpen && (
          <Sheet
            variant="outlined"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 'lg',
              overflow: 'hidden',
            }}
          >
            {/* Header with close button */}
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'primary.softBg',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MessageCircle size={20} />
                <Typography level="title-md">{t('chatbot.title')}</Typography>
              </Box>
              <IconButton size="sm" variant="plain" onClick={() => setIsOpen(false)}>
                <ChevronRight size={20} />
              </IconButton>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minHeight: 0,
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Sheet
                    variant="soft"
                    color={message.role === 'user' ? 'primary' : 'neutral'}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 'lg',
                      maxWidth: '85%',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography level="body-sm" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  </Sheet>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Sheet
                    variant="soft"
                    color="neutral"
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 'lg',
                    }}
                  >
                    <CircularProgress size="sm" />
                  </Sheet>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 1,
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.input-placeholder')}
                disabled={isLoading}
                sx={{ flex: 1 }}
              />
              <IconButton type="submit" disabled={isLoading || !input.trim()}>
                <Send size={20} />
              </IconButton>
            </Box>
          </Sheet>
        )}
      </Box>
    );
  }

  // Desktop: Always visible sidebar (no toggle)
  return (
    <Sheet
      variant="outlined"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'lg',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'primary.softBg',
        }}
      >
        <MessageCircle size={20} />
        <Typography level="title-md">{t('chatbot.title')}</Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minHeight: 0,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Sheet
              variant="soft"
              color={message.role === 'user' ? 'primary' : 'neutral'}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 'lg',
                maxWidth: '85%',
                wordBreak: 'break-word',
              }}
            >
              <Typography level="body-sm" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            </Sheet>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Sheet
              variant="soft"
              color="neutral"
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 'lg',
              }}
            >
              <CircularProgress size="sm" />
            </Sheet>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatbot.input-placeholder')}
          disabled={isLoading}
          sx={{ flex: 1 }}
        />
        <IconButton type="submit" disabled={isLoading || !input.trim()}>
          <Send size={20} />
        </IconButton>
      </Box>
    </Sheet>
  );
};
