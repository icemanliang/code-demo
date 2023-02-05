import { Base } from 'framework';
export default class Connect extends Base {
  private scope = 'email';
  private returnScopes = false;
  private xfbml = false;
  private static bPromise: Promise<any>;
  private settings() {
    return {
      status: true,
      cookie: true,
      xfbml: this.xfbml
    };
  }

  public open(options: any): Promise<{
    [k: string]: string;
  }> {
    if (options === undefined) {
      options = {};
    }
    const { authType } = options;

    return this.Load()
      .then(() => this.login(this.scope, this.returnScopes, authType))
      .then((response: any) => {
        const normalized: { [k: string]: string } = {
          userId: response.userID
        };
        if (response.grantedScopes) {
          normalized.grantedScopes = response.grantedScopes;
        }
        return normalized;
      });
  }

  private login(scope: string, returnScopes: boolean, authType: any) {
    return new Promise((resolve, reject) => {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            setTimeout(() => {
              resolve(response.authResponse);
            });
          } else {
            setTimeout(() => {
              reject(response.status);
            });
          }
        },
        { scope, return_scopes: returnScopes, auth_type: authType },
      );
    });
  }

  private Load() {
    if (Connect.bPromise) {
      return Connect.bPromise;
    }

    const settings = this.settings();
    return Connect.bPromise;
  }
}
