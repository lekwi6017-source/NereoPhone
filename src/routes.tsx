import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import WeChatIndex from '@/pages/WeChat/Index';
import Chats from '@/pages/WeChat/Chats';
import ChatView from '@/pages/WeChat/ChatView';
import Forum from '@/pages/WeChat/Forum';
import Moments from '@/pages/WeChat/Moments';
import PromptList from '@/pages/Prompts/List';
import PromptEdit from '@/pages/Prompts/Edit';
import MeIndex from '@/pages/Me/Index';
import PersonaEdit from '@/pages/Me/PersonaEdit';
import Settings from '@/pages/Settings';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    path: '/wechat',
    element: <WeChatIndex />,
    children: [
      { path: '/wechat', element: <Chats /> },
      { path: '/wechat/chats', element: <Chats /> },
      { path: '/wechat/chat/:id', element: <ChatView /> },
      { path: '/wechat/forum', element: <Forum /> },
      { path: '/wechat/moments', element: <Moments /> }
    ]
  },
  { path: '/prompts', element: <PromptList /> },
  { path: '/prompts/edit/:id', element: <PromptEdit /> },
  { path: '/me', element: <MeIndex /> },
  { path: '/me/persona/:id', element: <PersonaEdit /> },
  { path: '/settings', element: <Settings /> }
]);
