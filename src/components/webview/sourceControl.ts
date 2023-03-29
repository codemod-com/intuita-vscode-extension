
import axios from 'axios';
export class NotFoundRepositoryPath extends Error {}
export class NotFoundIntuitaAccount extends Error {}
interface ConfigurationService {
  getConfiguration(): { repositoryPath: string}
}
interface UserAccountStorage {
	getUserAccount(): string | null;
}


export class SourceControlService {
  constructor(private readonly __configurationService: ConfigurationService, private readonly __userAccountStorage: UserAccountStorage) {
  }

  async createIssue(title: string, body: string) {
      const { repositoryPath} =this. __configurationService.getConfiguration();
    
      if(!repositoryPath) {
        throw new NotFoundRepositoryPath('Missing repositoryPath, check extension configuration.')
      }
  
      const userId = this.__userAccountStorage.getUserAccount();
  
      if(!userId) {
        throw new NotFoundIntuitaAccount('Intuita account is not connected.')
      }
  
      const result = await  axios.post('https://telemetry.intuita.io/sourceControl/github/issues', {
        "repo": repositoryPath, 
        "userId": userId, 
        "body": body,
        "title": title,
      });

      return result.data;
  }
}
