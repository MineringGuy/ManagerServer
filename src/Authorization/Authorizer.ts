import { Account, SessionToken, TokenGenerator, TokenRights, TokenState, TokenValidator } from "../Server/Model";
import { logInvocation } from "../Shared/MethodDecorators";
import { countInstances } from "../Shared/ObjectsCounter";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";


@countInstances
export class Authorizer implements TokenGenerator, TokenValidator {
  // validateToken(tokenId: string): Promise<TokenRights> {
  //   throw new Error("Method not implemented.");
  // }

  private userCredDBAccess : UserCredentialsDBAccess
    = new UserCredentialsDBAccess();
  private sessionTokenDBAccess: SessionTokenDBAccess 
    = new SessionTokenDBAccess();

  @logInvocation
  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.userCredDBAccess.getUserCredential(
      account.username, account.password
    )
    if (resultAccount) {
      const token: SessionToken = {
        accessRights: resultAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        username: resultAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId()
      }
      await this.sessionTokenDBAccess.storeSessionToken(token);
      return token;
    } else {
      return undefined;
    }
  }

  public async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.sessionTokenDBAccess.getToken(tokenId);
    if (token) {
      console.log('exp: ' + token.expirationTime 
      + 'time: ' + new Date().toDateString());
    }

    if (!token || !token.valid) {
      console.log('Token Invalid');
      return {
        accessRights: [],
        state: TokenState.INVALID
      }
    } else if (token.expirationTime < new Date()){
      console.log('Token Expired');
      return {
        accessRights: [],
        state: TokenState.EXPIRED
      };
    } 
    console.log('Token Valid');
    return {
        accessRights: token.accessRights,
        state: TokenState.VALID
    }
  }

  private generateExpirationTime() {
    return new Date(Date.now());
    // return new Date(Date.now() + 60 * 60 * 1000);
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2);
  }

}