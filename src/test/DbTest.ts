
import { UserDBAccess } from "../User/UsersDBAccess";
import { UserCredentialsDBAccess } from "../Authorization/UserCredentialsDBAccess";



class DbTest {

  public dbAccess : UserCredentialsDBAccess
    = new UserCredentialsDBAccess();
  public userDbAccess: UserDBAccess
    = new UserDBAccess(); 
}

new DbTest().dbAccess.putUserCredential({
  username:'user1',
  password: 'password1',
  accessRights: [0, 1, 2, 3]
});

// new DbTest().userDbAccess.putUser({
//   age: 30,
//   email: 'some@email.com',
//   id: 'asd23234',
//   name: 'John Abc',
//   workingPosition: 3
// });