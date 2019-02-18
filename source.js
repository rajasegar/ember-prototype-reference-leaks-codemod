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
  installedApps: computed(function() {
    return get(this, 'store').findAll('installed-application');
  }),

  payloadList: [],
  awaitingAccessToken: false,
  init() {
    this._super(...arguments);
  },
  initialize(options) {
    set(this, 'options', options || {});
    get(this, 'options.auth_type') == 'OAuth' ? set(this, 'options.refresh_count', 0) : null;
    set(this, 'appName', options.app_name || 'Integrated Application');
    set(this, 'accessTokenRenewalUrl', options.is_customer ? HTTP_REQUEST_URL.accessTokenForCustomer : HTTP_REQUEST_URL.accessToken);
    set(this, 'httpProxyUrl', options.is_customer ? HTTP_REQUEST_URL.requestProxyForCustomer : HTTP_REQUEST_URL.requestProxy);
  },

  
});
