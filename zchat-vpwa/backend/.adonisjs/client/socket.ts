export interface AppSocket {

  readonly channels: {

    readonly 'activity': {

      readonly params: undefined

      readonly channel: typeof import('#channels/activity_channel').default

      readonly handlers: {

      }

    }

    readonly 'users/:id': {

      readonly params: {

        readonly 'id': string | number

      }

      readonly channel: typeof import('#channels/user_channel').default

      readonly handlers: {

        readonly 'sendMessage': 'send'

      }

    }

  }

}

