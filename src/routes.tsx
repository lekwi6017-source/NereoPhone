// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import WeChatIndex from './pages/WeChat/Index';
import Chats from './pages/WeChat/Chats';
import ChatView from './pages/WeChat/ChatView';
import Forum from './pages/WeChat/Forum';
import Moments from './pages/WeChat/Moments';
import PromptList from './pages/Prompts/List';
import PromptEdit from './pages/Prompts/Edit';
import MeIndex from './pages/Me/Index';
import PersonaEdit from './pages/Me/PersonaEdit';
import Settings from './pages/Settings';
// 可选：404 兜底
import React from 'react';

export const router = createBrowserRouter(
  [
    { path: '/', element: <Home /> },

    {
      path: '/wechat',
      element: <WeChatIndex />,
      children: [
        { index: true, element: <Chats /> },    // 相当于 /wechat
        { path: 'chats', element: <Chats /> },  // /wechat/chats
        { path: 'chat/:id', element: <ChatView /> },
        { path: 'forum', element: <Forum /> },
        { path: 'moments', element: <Moments /> },
      ],
    },

    { path: '/prompts', element: <PromptList /> },
    { path: '/prompts/edit/:id', element: <PromptEdit /> },
    { path: '/me', element: <MeIndex /> },
    { path: '/me/persona/:id', element: <PersonaEdit /> },
    { path: '/settings', element: <Settings /> },

    // 可选：前端兜底到首页（配合 public/404.html 更稳）
    { path: '*', element: <Home /> },
  ],
  {
    // 👇 GitHub Pages 子路径（与仓库名大小写一致）
    basename: '/NereoPhone',
  }
);
