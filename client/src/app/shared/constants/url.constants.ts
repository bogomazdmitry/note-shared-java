export const actionRoutes = {
  authSignup: 'signup',
  authToken: 'signin',

  userInfo: '',
  userChangeInfo: '',

  noteUpdate: 'update-note',
  noteDesignUpdate: 'update-note-design',
  noteCreate: '',
  noteDelete: 'delete-note',
  notesGet: '',
  notesSharedUsersEmails: 'shared-users-emails',
  notesUpdateOrder: 'update-order',
  noteTextUpdate: 'update-note-text',

  authCheckUniqueUserName: 'check-unique-user-name',
  authCheckUniqueEmail: 'check-unique-email',


  notificationDelete: 'delete-notification',
  notificationsGet: '',

  notesDeleteSharedUser: 'delete-shared-user',
  declineSharedNote: 'decline-shared-note',
  acceptSharedNote: 'accept-shared-note',
  requestSharedNote: 'share-note-with-user',
  deleteNoteFromOwner: 'delete-note-from-owner',
};

export const hubMethodSubscription = {
  deleteNoteFromOwner: '/user/delete-note-from-owner',
  noteTextUpdate: '/user/update-note-text',
  sendNewNotification: '/user/send-new-notification',
};

export const hubsRoutes = {
  note: '/hub/note',
  notifications: '/hub/notifications'
};

export const controllerRoutes = {
  auth: '/api/auth/',
  user: '/api/user/',
  notes: '/api/notes/',
  note: '/api/note/',
  notifications: '/api/notifications/',
};

export const authTokenRequestNames = {
  grantType: 'grant_type',
  clientId: 'client_id',
  username: 'username',
  password: 'password',
  scope: 'scope',
};

export const authTokenRequestValues = {
  password: 'password',
  scope: 'IdentityServerApi openid',
};

export const socketPrefix = '/ws';
