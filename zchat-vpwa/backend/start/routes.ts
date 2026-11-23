/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})
router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.post('channels/join', '#controllers/chats_controller.joinChannel')
        router.post('channels/:id/kick', '#controllers/chats_controller.kickUser')
        router.post('chats/direct', '#controllers/chats_controller.storeDirect')
        router.get('chats', '#controllers/chats_controller.index')
        router.patch('chats/:id/read', '#controllers/chats_controller.markDirectChatRead')
        router.get('users', '#controllers/chats_controller.searchUsers')
        router.post('channels', '#controllers/chats_controller.storeChannel')
        router.patch('channels/:id/read', '#controllers/chats_controller.markChannelRead')
        router.post('channels/:id/members', '#controllers/chats_controller.addChannelMember')
        router.get('chats/:id/messages', '#controllers/messages_controller.index')
        router.post('chats/:id/messages', '#controllers/messages_controller.store')
        router.delete('channels/:id', '#controllers/chats_controller.destroyChannel')
        router.delete('channels/:id/cancelsub', '#controllers/chats_controller.cancelSub')
        router.delete('channels/:id/members', '#controllers/chats_controller.revokeUser')
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/v1')
