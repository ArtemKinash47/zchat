import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.chats.store_direct': { paramsTuple?: []; params?: {} }
    'profile.chats.index': { paramsTuple?: []; params?: {} }
    'profile.chats.search_users': { paramsTuple?: []; params?: {} }
    'profile.chats.store_channel': { paramsTuple?: []; params?: {} }
    'profile.chats.add_channel_member': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.messages.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.messages.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.chats.destroy_channel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.chats.cancel_sub': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.chats.revoke_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.chats.index': { paramsTuple?: []; params?: {} }
    'profile.chats.search_users': { paramsTuple?: []; params?: {} }
    'profile.messages.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.chats.index': { paramsTuple?: []; params?: {} }
    'profile.chats.search_users': { paramsTuple?: []; params?: {} }
    'profile.messages.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.chats.store_direct': { paramsTuple?: []; params?: {} }
    'profile.chats.store_channel': { paramsTuple?: []; params?: {} }
    'profile.chats.add_channel_member': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.messages.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'profile.chats.destroy_channel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.chats.cancel_sub': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.chats.revoke_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}