import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { LoginHandler } from './LoginHandler';
import { Utils } from './Utils';
import { UsersHandler } from './UsersHandler';
import { Monitor } from '../Shared/ObjectsCounter';

export class Server {

  private authorizer: Authorizer = new Authorizer();
  private loginHandler: LoginHandler = new LoginHandler(this.authorizer);
  private usersHandler: UsersHandler = new UsersHandler(this.authorizer);

  public createServer() {
    console.log('class createServer instantiated');
    createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        console.log('got request from: ' + req.url);
        this.addCorsHeader(res);
        const basePath = Utils.getUrlBasePath(req.url);
        console.log('basePath is ' + basePath);
        
        switch (basePath) {
          case 'systemInfo':
            res.write(Monitor.printInstances());
            break;
          case 'login':
            this.loginHandler.setRequest(req);
            this.loginHandler.setResponse(res);
            await this.loginHandler.handleRequest();
            break;
          case 'users':
            this.usersHandler.setRequest(req);
            this.usersHandler.setResponse(res);
            await this.usersHandler.handleRequest();
            break;
          default:
            console.log('basePath default');
            break;
        }

        res.end();
      }
    ).listen(8080);
    console.log('server started');
  }

  private addCorsHeader(res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
  }
}