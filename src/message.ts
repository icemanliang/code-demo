import { getUser } from 'framework';

export default class BookConnect {

    private xml = false;
    public account : string ='';

    public settings() {
      return {
        status: true,
        cookie: true,
        xml: this.xml
      };
    }
}