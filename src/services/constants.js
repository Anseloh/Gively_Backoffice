module.exports = {
  // TOKEN_STORAGE_KEY: "WXS_M_TOKEN_STORAGE_KEY", /
  TOKEN_STORAGE_KEY: "token", // request token
  USER_NAME_KEY: "username",

  events: {
    NEW_MESSAGE: 'fe_new_message',
    NEW_MESSAGE_REQUIRE_SCROLL: 'fe_new_message_require_scoll',
    MESSAGE_REPLY_CLICKED: 'MESSAGE_REPLY_CLICKED',
    MESSAGE_DELETE_CLICKED: 'MESSAGE_DELETE_CLICKED',
  },
  DEFAULT_ERR_MESSAGE: 'An error occured while processing. Please retry in few minutes.'
};
