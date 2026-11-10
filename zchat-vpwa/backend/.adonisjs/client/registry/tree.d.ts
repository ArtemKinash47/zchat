/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    chats: {
      storeDirect: typeof routes['profile.chats.store_direct']
      index: typeof routes['profile.chats.index']
      searchUsers: typeof routes['profile.chats.search_users']
      storeChannel: typeof routes['profile.chats.store_channel']
      addChannelMember: typeof routes['profile.chats.add_channel_member']
      destroyChannel: typeof routes['profile.chats.destroy_channel']
      cancelSub: typeof routes['profile.chats.cancel_sub']
      revokeUser: typeof routes['profile.chats.revoke_user']
    }
    messages: {
      index: typeof routes['profile.messages.index']
      store: typeof routes['profile.messages.store']
    }
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
}
