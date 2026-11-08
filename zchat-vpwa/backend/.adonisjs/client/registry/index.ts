/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"signup"]],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"login"]],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.chats.store_direct': {
    methods: ["POST"],
    pattern: '/api/v1/account/chats/direct',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"chats"],[0,"direct"]],
    types: placeholder as Registry['profile.chats.store_direct']['types'],
  },
  'profile.chats.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/chats',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"chats"]],
    types: placeholder as Registry['profile.chats.index']['types'],
  },
  'profile.chats.search_users': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/users',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"users"]],
    types: placeholder as Registry['profile.chats.search_users']['types'],
  },
  'profile.chats.store_channel': {
    methods: ["POST"],
    pattern: '/api/v1/account/channels',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"channels"]],
    types: placeholder as Registry['profile.chats.store_channel']['types'],
  },
  'profile.messages.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/chats/:id/messages',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"chats"],[1,"id"],[0,"messages"]],
    types: placeholder as Registry['profile.messages.index']['types'],
  },
  'profile.messages.store': {
    methods: ["POST"],
    pattern: '/api/v1/account/chats/:id/messages',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"chats"],[1,"id"],[0,"messages"]],
    types: placeholder as Registry['profile.messages.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"logout"]],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
