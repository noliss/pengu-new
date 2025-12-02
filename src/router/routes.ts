import type { ComponentType, JSX } from 'react';
import { Collections } from '../pages/Collections/Collections';
import { Generate } from '../pages/Generate/Generate';
import { Profile } from '../pages/Profile/Profile';
import { ROUTES } from './paths';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { 
    path: ROUTES.COLLECTIONS, 
    Component: Collections 
  },
  { 
    path: ROUTES.GENERATE, 
    Component: Generate,
    title: 'Generate'
  },
  { 
    path: ROUTES.PROFILE, 
    Component: Profile,
    title: 'Profile'
  },
];