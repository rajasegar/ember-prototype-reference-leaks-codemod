import Ember  from 'ember';

const {
  Service,
  computed,
  inject: { service },
  RSVP: { Promise },
  get,
  set
} = Ember;
const CONTENT_TYPE = 'application/json';
const HTTP_REQUEST_URL = Integration.proxyUrls;

export default Service.extend({
  ajax: service(),
  store: service(),
  currentAccount: service(),
  options: {},
  appName: null,
  accessTokenRenewalUrl: null,
  callbacksAwaitingAccessToken: [],
  httpProxyUrl: null,
  payloadList: [],
  awaitingAccessToken: false,
  init() {
    this._super(...arguments);
  }

  
});
