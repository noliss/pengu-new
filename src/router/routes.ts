import type { ComponentType, JSX } from 'react';
import { Collections } from '../pages/Collections/Collections';
import { Generate } from '../pages/Generate/Generate';
import { Profile } from '../pages/Profile/Profile';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { 
    path: '/', 
    Component: Collections 
  },
  { 
    path: '/generate/', 
    Component: Generate,
    title: 'Generate'
  },
  { 
    path: '/profile/', 
    Component: Profile,
    title: 'Profile'
  },
];