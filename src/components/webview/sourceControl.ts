
import axios from 'axios';
export class NotFoundRepositoryPath extends Error {}
export class NotFoundIntuitaAccount extends Error {}
interface ConfigurationService {
  getConfiguration(): { repositoryPath: string  | undefined}
}
interface UserAccountStorage {
	getUserAccount(): string | null;
}

export class SourceControlService {
  constructor(private readonly __configurationService: ConfigurationService, private readonly __userAccountStorage: UserAccountStorage) {
  }

  async createIssue(params: {title: string, body: string}) {
      const { repositoryPath} =this. __configurationService.getConfiguration();
    
      if(!repositoryPath) {
        throw new NotFoundRepositoryPath()
      }
  
      const userId = this.__userAccountStorage.getUserAccount();
  
      if(!userId) {
        throw new NotFoundIntuitaAccount()
      }
  
      const { title, body} = params;

      const result = await  axios.post('https://telemetry.intuita.io/sourceControl/github/issues', {
        "repo": repositoryPath, 
        "userId": userId, 
        "body": body,
        "title": title,
      });

      return result.data;
  }
}
